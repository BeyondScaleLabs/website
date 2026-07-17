---
id: core-concepts
title: Core Concepts
sidebar_label: Core Concepts
sidebar_position: 2
---

This page explains the fundamental building blocks of Kaiden. Understanding these makes the rest of the application easier to navigate.

---

## The three layers

Kaiden organises all agentic work in three layers:

```
Project  →  Sandbox  →  Session
```

### Project

A **project** represents a codebase. It is the place where you define the defaults that should apply to every agent run against that codebase: which credentials are available, which network hosts can be reached, which skills and MCP servers are enabled.

You create a project once. Everything you configure at the project level is inherited automatically by every sandbox and session under it.

Projects live in the **Projects** sidebar view.

### Sandbox

A **sandbox** is a secured, persistent environment created for a project. It is the isolated container or MicroVM where agents actually run. A sandbox:

- Is created once and can be stopped and restarted without losing its configuration
- Has its own filesystem scope — the agent can only touch the project directory
- Enforces the network policy and credentials defined by its project
- Can host multiple concurrent sessions

Think of a sandbox as a long-lived secured workspace for a project. You don't recreate it for every agent task — you start a new session inside it.

Sandboxes live in the **Sandboxes** sidebar view.

### Session

A **session** is one agent run with a specific goal, inside a sandbox. Sessions are ephemeral: they start, the agent works, and they stop. Multiple sessions can run simultaneously inside the same sandbox.

Sessions live in the **Work** sidebar view, which acts as the day-to-day cockpit showing everything running right now.

---

## Agents and models

**Agents** and **models** are separate concepts in Kaiden.

An **agent** is the coding assistant — Claude Code, Goose, Cursor CLI, and so on. It has its own CLI, its own reasoning approach, and its own way of interacting with files and tools.

A **model** is the underlying language model the agent calls to generate responses — `claude-sonnet-4-6`, `gemini-2.5-pro`, a local Ollama model, and so on.

One agent can use different models. You pick the agent when creating a sandbox, and the model when starting a session (or set a default per agent in the Coding Agents section).

---

## Configuration inheritance

Settings flow from the outside in. Each layer can override the one above it.

```
Project defaults
  └─ Sandbox (inherits project, can override)
       └─ Session (inherits sandbox)
```

For example: a project defines an allowed network host. A sandbox inherits it. A session running in that sandbox can reach that host without any extra configuration. If a sandbox needs an additional host not in the project policy, it can add it — without changing the project defaults for other sandboxes.

---

## The sandbox runtime

Kaiden uses **OpenShell** as the sandbox runtime. OpenShell manages the actual container or MicroVM, enforces the network policy, injects credentials, and logs security events. Kaiden talks to OpenShell through the **kdn** CLI.

Two isolation modes are available:

**Podman** — container-based isolation. The agent runs inside a container image (a purpose-built environment for the chosen agent) that shares the host kernel. Fast to start, low resource overhead, and sufficient for the vast majority of coding tasks: web services, scripting, cloud-native development, and most backend work.

**MicroVM** — the agent gets a complete virtual machine with its own kernel and a full OS appliance, not a container image. From the agent's perspective, it has a full host to operate on. This opens up workloads that containers cannot support cleanly:
- Building native or mobile applications that require system-level toolchains
- Tasks that need kernel headers, kernel modules, or low-level OS access
- Running processes that themselves need to manage containers or VMs
- Maximum isolation from the host for high-sensitivity environments

MicroVM takes longer to start and uses more resources than Podman. The right choice depends on what the agent needs to do, not just on security posture.

The active runtime and its status are always visible in the bottom status bar and in **Settings → Resources**.

---

## Credentials and network access

Kaiden uses a **deny-by-default** network model. A sandbox cannot reach any host on the internet unless it has been explicitly allowed.

There are two ways a host becomes allowed:

1. **Via a credential** — when you attach a secret (e.g., a GitHub token) to a sandbox, the hosts that credential needs (`api.github.com`) are automatically added to the allow list.
2. **Via a manual rule** — you can add any host explicitly in the project's Network Policy.

Credentials are never stored as plain text inside the sandbox. They are injected by the runtime as HTTP headers at the moment a request is made. The agent makes an ordinary API call; the credential handling is invisible.
