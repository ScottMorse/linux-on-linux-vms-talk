---
title: Linux on Linux - Local VMs for Sandboxed Workflows
marp: true
theme: linux-on-linux
paginate: true
html: true
---

<!-- _class: lead -->
<!-- _paginate: false -->

# Scott Morse

![height:250 center](assets/pacwich.png)

<div class="link-list">

**GitHub**: [https://github.com/ScottMorse](https://github.com/ScottMorse)

**pacwich docs**: [https://pacwich.dev](https://pacwich.dev)

**Blog**: [https://smorsic.io/blog](https://smorsic.io/blog)

</div>

<!--
- Introduce self
- Check out pacwich for Monorepo tooling
- See me for holographic stickers after
- Check out my blog
  - It's linked in the pacwich docs
  - OSS releases and engineering philosophy
-->

---

# Linux on Linux

## Local VMs for Sandboxed Workflows

<div class="talk-notes">

[https://github.com/ScottMorse/linux-on-linux-vms-talk](https://github.com/ScottMorse/linux-on-linux-vms-talk)

</div>

---

# Advantages of VMs

A virtual machine provides a **fully separate operating system** that
can act as a development sandbox.

Modern VM tooling is **highly optimized**:

- A VM's instructions can run directly on **real CPU cores** securely
- Resources you allocate are **only used when needed** (CPU, RAM, storage, etc.)

## VMs _vs._ Containers

Containers are _more lightweight_ but _less isolated_.

## Advantage of Linux

Linux's kernel provides a **native hypervisor**, distributions can
make **ideal VM images** (light, open, free), using Linux
for the host and guest means a **consistent experience**, and tooling is **highly scriptable**.

<!--
- Running local VMs on your machine might be more realistic than you think

- Containers:
  - Share the host system's kernel so an attacker could potentially escalate privileges
  - Note: Docker containers on macOS share a Linux VM under teh hood

- Linux:
  - The scriptablity turned out to be a major advantage for me (more convenient to use)
-->

---

# VM Overlays

An **overlay** is an optimized layer on top of a **base VM image** that
is like a **lightweight clone**.

An overlay:

- Acts like a **separate VM**
- Is **fast** to spin up and tear down
- Is **storage-optimized**: only writes its changes on top of the base system
- Can be given a **dedicated shared filesystem** (host-owned directory acts like a mounted drive)

This can be ideal for development:

1. Spin up a fresh overlay for some task
2. Share a specific directory to the overlay
3. Experiment/develop freely
4. Discard when done (base VM stays clean)

<!--
Notes:
- No OS installation for an overlay
-->

---

# My Agentic Development Workflow

## Scripting VM and git operations

I use a personal CLI to:

- Help me set up a **fresh VM** base system
- Manage named overlays on top of the base (**create**, **open**, **destroy**, etc.)
- **Stage a repo** on a given overlay's shared directory
- **Sync code changes** to and from the overlay

## Syncing Code Changes

I prefer to use **git bundles** to sync code changes from an overlay.

- A **bundle** is a portable pack of commits that can be transferred between repositories
- I sync bundles between a dedicated **git worktree** on the host and the overlay's shared directory
- I avoid directly interacting with the VM-owned repo and only pull committed source changes

---

![height:670](diagrams/excalidraw-overlays.svg)

---

# Personal CLI Example Workflows

```bash
$ # See state of all projects' worktrees and overlays
$ # E.g. whether ahead/behind the main repo's current branch,
$ # or if VM overlays are synced between host/guest
$ project state
$
$ project go pacwich # cd to my main pacwich repo
$
$ # Commands can infer project from cwd
$ project claude # Open Claude session for current project
$ project code # Open IDE for current project
$
$ # Worktree commands
$ project wt create my-local-feature # Create a local git worktree (no VM involved)
$ project wt go my-local-feature # cd to the worktree
$ project wt claude # Open Claude session for the worktree
$ project wt code # Open IDE for the worktree
$ project go # cd back to main repo
$ git merge my-local-feature # Maybe merge changes from generated branch
$ project wt remove my-local-feature # Tear down the worktree
$
$ # VM overaly commands (similar to worktree commands)
$ project vm up my-vm-feature --open # Create and open a fresh VM overlay
$ project vm go my-vm-feature # cd to the host-owned worktree
$ project vm diff # See git diff of VM-owned changes
$ project vm pull # Sync code changes from the VM to host's worktree
$ project vm code # Open IDE for the host-owned worktree
$ project vm push # Sync code changes to the VM
$ project go # cd back to main repo
$ git merge my-vm_pacwich_my-vm-feature # Maybe merge changes from host worktree
$ project vm down my-vm-feature # Tear down the VM overlay
```
