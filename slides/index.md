---
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

# Noteworthy Tools

![height:560](diagrams/noteworthy-tools.svg)
