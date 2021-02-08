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
deno run --unstable --allow-run --allow-net https://x.nest.land/dkill@0.3.0/cli.ts
```

### Install

```
deno install --unstable --allow-run --allow-net https://x.nest.land/dkill@0.3.0/cli.ts
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
    -v, --verbose  - Increase verbosity
    -d, --dryrun   - Dry run, List the pids that would have been killed. Does not kill anything
```

## Programatic Usage

mod.ts exports multiple functions that can be used programmatically. Check
source code for info

- dkill(targets: { pids?: number[]; ports?: number[]; procs?: string[]; },
  opts?: { verbose?: boolean, dryrun?: boolean })
- port2pid()
- killPids()

## Support

- Windows
  - [x] port
  - [x] pid
  - [ ] process
- Linux
  - [x] port
  - [x] pid
  - [ ] process
- Mac
  - [ ] port
  - [ ] pid
  - [ ] process

## TODOs

- [ ] provide process names killed
- [ ] kill by process name
- [ ] supply multiple values to cli in on go
- [ ] on linux check if `ss` is present.

## Inspiration

- nodejs [fkill-cli](https://www.npmjs.com/package/fkill-cli)
