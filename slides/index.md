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

---

# Linux on Linux

## Local VMs for Sandboxed Workflows

<div class="talk-notes">

[https://github.com/ScottMorse/linux-on-linux-vms-talk](https://github.com/ScottMorse/linux-on-linux-vms-talk)

</div>

---

# Why VMs?

A local virtual machine provides a **fully separate operating system**.

Modern VM tooling is **highly optimized** so that you only use the resources you need.

- VM's instructions run on **real CPU cores** securely
  - Only the cores actually being used are taken, up to the max allocated
- Storage and memory
  operate similarly, where **only the space needed is used**.

## For Development

You get an entire system you own as a sandbox to **experiment** with or **run an agent more freely**,
with a full-featured desktop environment.

---

# VMs vs. Containers

Containers are:

- More lightweight
- Less isolated
  - Share the host's kernel
    - macOS nuance: Docker Desktop uses a Linux VM to run containers, but all containers share that VM's kernel
  - Limited to a headless environment
    - Browser work must happen on your host
    - Less can be provided within the isolated sandbox to an agent
  - Isolation is at the **process** level, rather than the **machine** level

---

# Advantages of Linux

- For the guest system, Linux is often the ideal OS for a virtual machine
  - Linux distributions are free, open, and lightweight
- For the host system, Linux is also a strong choice
  - A regular Linux user can have a similar development experience in the VM as on the host
  - The Linux kernel ships with virtualization capabilities
  - Strong tooling for script-driven VM management

# macOS Host

- A similar architecture described in this talk can be achieved with different tools
- Only ARM-compatible Linux distributions can run on Apple Silicon machines

# Windows Host

- WSL2 is a Windows-native virtualization layer on top of WSL that's closer to Linux's in
  experience and optimization

---

# Noteworthy Tools

- **KVM**
  - **K**ernel-based **V**irtual **M**achine
  - Already part of the the Linux kernel
  - Provides CPU cores and RAM to a guest system
- **QEMU**
  - **Q**uick **Emu**lator
  - Emulates the rest of the hardware (PCI, display, USB, etc.)
- **libvirt**
  - API, CLI, and daemons on top of QEMU
  - Declaratively manage VMs
  - Takes XML configuration
- **virt-manager**: GUI for libvirt
- **virtiofsd**: Provides shared filesystems between host and guest

---

##### Basic VM Architecture

![height:620](diagrams/noteworthy-tools.svg)

---

# Overlays

What do you do when you want multiple VMs that are isolated from each other?

**Overlays** provide an optimized layer on top of a **base VM image** that
act light lightweight clones.

An overlay:

- Acts like a separate VM
- Is fast to spin up and tear down once your base image exists
- Is optimized for space and performance
  - Storage: only its changes on top of the base system are written
  - CPU/RAM: allocated just like any other VM
- Can have a dedicated shared filesystem
  - You can stage a project's code in a shared directory from your host
