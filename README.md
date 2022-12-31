[![deno module](https://shield.deno.dev/x/dkill)](https://deno.land/x/dkill)
![deno compatibility](https://shield.deno.dev/deno/^1.21.3)

<h1 align="center">
  🎯 dkill
</h1>

<p align="center">
  <b>kill processes identified by port in Deno 🦕</b>
</p>

## CLI Usage

### Install

```
deno install -f --allow-run --allow-net https://deno.land/x/dkill@0.7.0/cli.ts
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

See [docs](https://doc.deno.land/https://deno.land/x/dkill/mod.ts)

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
