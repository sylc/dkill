<h1 align="center">
  🎯 dkill
</h1>

<p align="center">
  <b>kill processes by pid and ports for Deno 🦕</b>
</p>

## CLI Usage

### Run directly

```
deno run --unstable --allow-run --allow-net https://deno.land/dkill@v0.6.5/cli.ts
```

### Install

```
deno install --unstable --allow-run --allow-net https://deno.land/x/dkill@v0.6.5/cli.ts
```

You can then use it using command `dkill`

```
$ dkill --help

Usage:   dkill <targets...>
  Version: v0.0.1

  Description:

    Kill any processes by
      - port: Prefix port number by a colon. ex: 'dkill :3000'
      - pid: A valid integer. ex: 'dkill 12654'
      - process name: A string ex: 'dkill Code.exe'

        You can specify multiple targets at once. ex: 'dkill :5000 :3000 164'

  Options:

    -h, --help     - Show this help.
    -V, --version  - Show the version number for this program.
    -v, --verbose  - Increase verbosity
    -d, --dryrun   - Dry run, List the pids that would have been killed. Does not kill anything
```

## Programatic Usage

mod.ts exports multiple functions that can be used programmatically. Check
source code for more info

- dkill(targets: { pids?: number[]; ports?: number[]; procs?: string[]; },
  opts?: { verbose?: boolean, dryrun?: boolean })
- killPids(): Kill an array of pid
- pidToCmd(): get the command that started a pid
- portToPid(): find the pid go a given port
- procList(): list all process running
- procToPid(): find the pid for a given process name

## Support

### Windows

> On windows, to retrieve the command line, Powershell is used, which requires
> windows 8 or above.

### Linux

> On linux the cmd `ss` is used, which works on ubuntu 16.04 and above.

### Mac

Not implemented. PR welcome.

- [ ] port
- [ ] pid
- [ ] process

## TODOs

- [ ] on windows check if `powershell` is present.
- [ ] on linux check if `ss` is present.
- [ ] improve docs for submodule

## Inspiration

- nodejs [fkill-cli](https://www.npmjs.com/package/fkill-cli)
