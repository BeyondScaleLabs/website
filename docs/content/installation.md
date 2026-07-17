---
id: installation
title: Installation
sidebar_label: Installation
sidebar_position: 2
---

Kaiden is a desktop application available for macOS, Windows, and Linux. The kdn and OpenShell CLI tools it depends on are downloaded and managed from inside the app — you don't install them separately.

---

## Download

Stable releases and nightly builds are published to the [openkaiden/prereleases](https://github.com/openkaiden/prereleases/releases) repository on GitHub.

| Platform | Format | Architecture |
|---|---|---|
| macOS | `.dmg` | Apple Silicon (arm64) |
| Windows | `.exe` installer or portable | x64, arm64 |
| Linux | `.flatpak` or `.tar.gz` | x64, arm64 |

Download the file for your platform, open it, and follow the standard install steps for your OS.

---

## Prerequisites

**macOS and Windows:** no prerequisites beyond Podman (see below). Kaiden bundles everything else it needs.

**Linux (Flatpak):** requires Flatpak to be installed on your system. Most major distributions ship it by default or have it in their package manager.

### Podman

Kaiden uses **Podman** to create and manage sandboxes. It must be installed and running on your machine before you can create your first sandbox.

The easiest way to get Podman on any platform is **[Podman Desktop](https://podman-desktop.io)** — a graphical application that installs and manages Podman for you. Download it from [podman-desktop.io](https://podman-desktop.io), run the installer, and Podman Desktop will handle the rest including starting the Podman machine on macOS and Windows.

If you prefer a CLI-only install, Podman is also available via standard package managers:

```bash
# Fedora / RHEL
sudo dnf install podman

# macOS
brew install podman && podman machine init && podman machine start
```

If Kaiden cannot detect a running Podman instance at launch, **Settings → Resources** will show a warning with a direct link to Podman Desktop.

---

## First launch

On first launch, Kaiden checks for the kdn and OpenShell CLI tools. If they are not yet installed, a setup prompt guides you through installing them in one click. Their versions are visible at any time under **Settings → CLI Tools**.

---

## Staying up to date

Kaiden checks for updates automatically. When a new version is available, you'll see a notification in the app. CLI tools (kdn and OpenShell) can be updated independently from **Settings → CLI Tools** without reinstalling the desktop app.

---

## Building from source

If you'd like to run the latest development version:

```bash
git clone https://github.com/openkaiden/kaiden
cd kaiden
pnpm install
pnpm watch
```

Requirements: Node.js 24+, pnpm 10.x.
