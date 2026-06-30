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

---

# Why VMs?

A local virtual machine provides a **fully separate operating system**.

Modern VM tooling is **highly optimized** so that you only use the resources you need.

For example, the VM's instructions run on **real CPU cores** securely, and only
the cores actually being used are taken, up to the max allocated.

Storage and memory
operate similarly, where **only the space needed is used**.

## For Development

You get an entire system you own as a sandbox to **experiment** with or **run an agent more freely**,
with a full-featured desktop environment.

---

# VMs vs. Containers

- Containers
  - More lightweight
  - Share the host's kernel
  - Isolation limited to a headless environment

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

![height:600](diagrams/noteworthy-tools.svg)
