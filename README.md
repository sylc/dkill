# dkill

Deno cli to kill processes and ports

## CLI Usage

### Run directly

```
deno run --unstable --allow-run --allow-net ./cli.ts
```

### Install

```
deno install --unstable --allow-run --allow-net ./cli.ts
```

```
$ dkill --help

Usage:   dkill <pid_name_port>
  Version: v0.0.1

  Description:

    Kill any process by
         - port: add a semicolon in front to define it as a port. ex: dkill :3000
         - pid: not implemented yet
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

## Inspiration

- nodejs [fkill-cli](https://www.npmjs.com/package/fkill-cli)
