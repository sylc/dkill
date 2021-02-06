[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/your-module)

<h1 align="center">
  🎯 dkill
</h1>

<p align="center">
  <b>kill processes and ports for Deno 🦕</b>
</p>

## CLI Usage

### Run directly

```
deno run --unstable --allow-run --allow-net https://x.nest.land/dkill@0.2.3/cli.ts
```

### Install

```
deno install --unstable --allow-run --allow-net https://x.nest.land/dkill@0.2.3/cli.ts
```

You can then access use it using command `dkill`

```
$ dkill --help

Usage:   dkill <pid_name_port>
  Version: v0.0.1

  Description:

    Kill any process by
         - port: add a semicolon in front to define it as a port. ex: 'dkill :3000'
         - pid: a valid integer. ex: 'dkill 12654' 
         - process name: not implemented yet

  Options:

    -h, --help     - Show this help.
    -V, --version  - Show the version number for this program.
```

## Programatic Usage

mod.ts exports multiple functions

- dkill
- port2pid
- killPids

## Support

- Windows
  - [x] port
  - [x] pids
  - [ ] process
- Linux
  - [ ] port
  - [x] pids
  - [ ] process
- Mac
  - [ ] port
  - [ ] pids
  - [ ] process

## Inspiration

- nodejs [fkill-cli](https://www.npmjs.com/package/fkill-cli)
