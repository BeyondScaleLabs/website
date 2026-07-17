---
id: openshell-gateways
title: OpenShell Gateways
sidebar_label: OpenShell Gateways
sidebar_position: 10
---

The gateway is the **control plane** of OpenShell. Every CLI command, SDK call, and UI interaction goes through it. It owns all durable platform state — sandboxes, policy revisions, provider credentials, inference configuration, and SSH sessions — and it coordinates the sandbox supervisor processes that run inside each agent environment.

OpenShell is structured around three runtime components:

```
CLI / SDK / UI  ──gRPC──►  Gateway  ──provisions──►  Compute Driver
                               │                            │
                               │◄──outbound connection──  Supervisor (inside sandbox)
```

The critical design choice: **supervisors connect outbound to the gateway, never the other way around.** This eliminates NAT traversal, port-mapping complexity, and the need for the gateway to know sandbox network addresses.

---

## The Supervisor

The supervisor is a process that runs **inside every sandbox**, alongside the agent. It is not part of the gateway or the host — it is the local security boundary at the workload level.

### Where it runs

| Driver | Supervisor location |
|---|---|
| Docker / Podman | A process inside the sandbox container, started before the agent |
| Kubernetes | A process inside the sandbox pod |
| MicroVM | A process inside the VM |

### What it does

The supervisor enforces all security controls locally, from inside the sandbox:

| Layer | What it enforces |
|---|---|
| **Process** | Drops privileges; starts the agent as an unprivileged child process |
| **Filesystem** | Locks undeclared paths using Landlock LSM before the agent starts |
| **Network** | Routes all outbound traffic through a local proxy backed by an OPA policy engine |
| **Credentials** | Injects credentials as opaque placeholders into the agent's environment; resolves them at the proxy boundary when the agent makes HTTP requests |
| **Inference** | Intercepts calls to `inference.local` and routes them to the configured provider, hiding API keys from the agent |
| **Observability** | Collects sandbox logs and relays them to the gateway; manages session state |

### Why enforcement happens inside the sandbox

Policy enforcement cannot happen at the gateway level for one key reason: **the gateway cannot observe which process is making an outbound connection**. The proxy inside the supervisor can — it runs in the same namespace as the agent and can match each outbound TCP connection to the binary that opened it. This is what allows a policy rule like "only `/usr/bin/gh` may call `api.github.com`" to actually mean something.

### Static vs. dynamic controls

Some supervisor controls are locked in at sandbox creation time:

- Filesystem path locks (Landlock rules)
- Process isolation settings (seccomp filters, unprivileged user/group)

Others can be updated over the live stream while the sandbox is running:

| Category | Can update live? | Requires sandbox restart? |
|---|---|---|
| Network egress policy | Yes | No |
| Credential values | Yes | No |
| Inference routing | Yes | No |
| Filesystem locks | No | Yes |
| Process isolation (seccomp, Landlock) | No | Yes |

---

## Compute Drivers

| Driver | Sandbox location | Best for |
|---|---|---|
| **Docker** | Containers on the gateway host | Solo development, quick iteration |
| **Podman** | Rootless containers | Workstations avoiding rootful Docker daemon |
| **Kubernetes** | Operator-managed cluster pods | Shared clusters, cloud environments, GPU workloads |
| **MicroVM** | VM-backed sandboxes | Workflows requiring VM-level isolation |

Auto-detection order when no driver is configured: Kubernetes → Podman → Docker. MicroVM is never auto-detected and must be configured explicitly.

All drivers expose an identical gateway API surface. Sandboxes, policies, and providers behave consistently regardless of which driver is active.

---

## Authentication

The gateway listens on a single service port and multiplexes gRPC and HTTP traffic. Supported authentication modes:

| Mode | When to use |
|---|---|
| **mTLS user auth** | Local single-user Docker, Podman, or VM gateways |
| **Plaintext** | Local development behind a trusted reverse proxy |
| **Unauthenticated local users** | Trusted Kubernetes dev clusters; requires `allow_unauthenticated_users = true` |
| **Cloudflare JWT** | Edge-authenticated deployments where Cloudflare Access supplies identity |
| **OIDC** | Bearer-token auth with browser PKCE or client credentials login |

Kaiden uses `allow_unauthenticated_users = true` for local single-user operation — the gateway only listens on loopback and there is only one user.

---

## Registering and Managing Gateways

### Adding a gateway

```shell
# Local gateway (trusted, no browser login)
openshell gateway add http://127.0.0.1:17670 --local --name local

# Remote authenticated gateway (triggers browser PKCE login)
openshell gateway add https://gateway.example.com --name production

# Re-authenticate after token expiry
openshell gateway login production
```

### Active gateway resolution (priority order)

1. `OPENSHELL_GATEWAY` environment variable (per-command override, highest priority)
2. `-g` flag (per-command override)
3. Persisted default set by `gateway add` or `gateway select`

```shell
# Switch persisted default
openshell gateway select production

# Single-command override
openshell status -g staging
openshell sandbox list -g staging
```

### Useful commands

```shell
openshell gateway list             # all registered gateways
openshell gateway info             # active gateway metadata and compute driver details
openshell gateway remove prod      # remove user-level registration
openshell status                   # quick health check against active gateway
```

---

## Service Forwarding

When an agent starts a network service inside the sandbox (a dev server, Jupyter notebook, REST API), you can reach it from your host browser via service forwarding.

Exposed sandbox services are reachable at:

```
http://<sandbox-name>.openshell.localhost:<port>/
http://<sandbox-name>--<service-name>.openshell.localhost:<port>/
```

The gateway routes these requests through the supervisor relay — no manual port binding or Docker `-p` flags needed.

---

## Configuration (TOML)

The gateway reads configuration from three sources, in descending priority:

```
CLI flags  >  OPENSHELL_* env vars  >  TOML config file  >  built-in defaults
```

The TOML file is optional. When neither `--config` nor `OPENSHELL_GATEWAY_CONFIG` is set, the gateway uses only flags and env vars.

```toml
[openshell]
version = 1

[openshell.gateway]
bind_address        = "127.0.0.1:17670"
log_level           = "info"
compute_drivers     = ["kubernetes"]

[openshell.gateway.auth]
allow_unauthenticated_users = false

[openshell.gateway.oidc]
issuer      = "https://idp.example.com/realms/openshell"
audience    = "openshell-cli"
admin_role  = "openshell-admin"
user_role   = "openshell-user"
```

Driver-specific tables (`[openshell.drivers.podman]`, `[openshell.drivers.kubernetes]`, etc.) set image pull policy, socket paths, and network names.

:::note
`database_url` must be supplied via `OPENSHELL_DB_URL` or `--db-url` — it is rejected if present in the TOML file to prevent accidental credential commits.
:::

---

## How Credentials Work End to End

When an agent uses a credential inside a sandbox (e.g., a GitHub PAT for the `gh` CLI):

1. The gateway stores the token value encrypted in SQLite. The CLI never echoes it back.
2. At sandbox creation, the supervisor injects the token as an **opaque placeholder** in the agent's environment:
   ```
   GITHUB_TOKEN=openshell:resolve:env:GITHUB_TOKEN
   ```
3. When the agent makes an HTTP request to `api.github.com`, the supervisor's proxy intercepts it, detects the placeholder in the `Authorization` header, calls the gateway to resolve the real token, and forwards the request with the real credential.
4. The agent receives a normal response. The real token never appears in the sandbox process environment, in logs, or in the agent's output.

**Fail-closed:** If the placeholder cannot be resolved (expired provider, gateway unreachable), the proxy rejects the request — the raw placeholder is never forwarded.

---

## Troubleshooting

| Symptom | Where to look |
|---|---|
| "cannot connect to gateway" | `openshell status` and `openshell doctor check` |
| Sandbox stuck in Provisioning | Driver-specific logs (Docker daemon, Kubernetes events, Podman socket) |
| `exec`/`connect` hangs | Gateway logs for relay errors; supervisor relay session may have dropped |
| Sandboxes all Unknown after restart | Supervisors reconnect automatically; re-initiate running exec sessions |

```shell
# Health check
openshell status
openshell doctor check

# systemd (Docker/Podman)
systemctl --user status openshell-gateway
journalctl --user -u openshell-gateway --no-pager -n 50

# Kubernetes
kubectl -n openshell get pods
kubectl -n openshell logs deployment/openshell -c openshell-gateway --tail=100
```
