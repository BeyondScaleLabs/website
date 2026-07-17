---
id: network-security
title: Network Security
sidebar_label: Network Security
sidebar_position: 8
---

Every Kaiden sandbox runs with a **deny-by-default** network policy. The agent cannot reach any host on the internet unless it has been explicitly allowed. This page explains how that policy works and how to configure it.

---

## Network modes

When creating a sandbox, you choose one of three network modes:

| Mode | What the agent can reach |
|---|---|
| **Developer Preset** (recommended) | Package registries — npm, PyPI, and similar developer infrastructure. Not arbitrary public hosts. |
| **Deny All** | No outbound HTTP or HTTPS. For fully offline tasks or when you want to enumerate every host manually. |
| **Unrestricted** | All outbound traffic. For trusted environments where you want no restrictions. |

**Developer Preset** is the default. It covers the registries most coding tasks need without opening the agent to the broader internet.

**Unrestricted** is only available with the Podman runtime. When using the OpenShell (MicroVM) runtime, it is disabled.

**Agent mode** (per-request approval, human in the loop) is planned but not yet available.

---

## Adding custom hosts

In both **Deny All** and **Developer Preset** modes, you can add specific additional hosts the agent is allowed to reach. Enter them as hostnames (e.g. `api.example.com`) in the custom hosts field during creation or in the sandbox's Network settings after creation.

This is how you allow a private API, an internal service, or any host not covered by the preset.

---

## How credentials affect network access

When you attach a credential (secret) to a sandbox, the hosts that credential covers are handled by the sandbox runtime automatically. For example, a GitHub token allows the agent to reach `api.github.com` — you don't need to add it manually to the host list.

The credential value itself is injected by the runtime as an HTTP header at request time. The agent never sees the value directly.

---

## Where the network policy is stored

The network policy for each sandbox is stored in `.kaiden/workspace.json` in the project folder, under the `network` key:

```json
{
  "network": {
    "mode": "deny",
    "hosts": ["api.example.com", "registry.npmjs.org"]
  }
}
```

- `mode: "allow"` — unrestricted
- `mode: "deny"` with a `hosts` list — deny all except the listed hosts (Developer Preset or Deny All with custom hosts)
- `mode: "deny"` with no hosts — fully deny all (Deny All with no additions)

This file travels with the codebase. You can commit it to share the network configuration with teammates.

---

## Updating the network policy after creation

Open the sandbox's detail page and go to the **Settings → Network** tab. The same mode selector and custom host list are available there, and changes are saved to `.kaiden/workspace.json`. The new policy takes effect the next time the sandbox starts.

---

## Viewing the current network mode

The sandbox detail **Overview** page shows the active network mode as one of three labels:

- **Unrestricted** — mode is `allow`
- **Developer Preset** — mode is `deny` with a host list
- **Deny All** — mode is `deny` with no host list

---

## What the sandbox prevents

The sandbox enforces isolation at the runtime level. Even if the agent is tricked into running a malicious script, that script cannot reach hosts outside the configured allow list. The enforcement is done by OpenShell (the underlying sandbox runtime) — it is not an application-level firewall that the agent can work around.

For filesystem isolation, see the File System section in [Your First Sandbox](your-first-sandbox).
