[![JSR](https://jsr.io/badges/@sylc/dkill)](https://jsr.io/@sylc/dkill)
![deno compatibility](https://shield.deno.dev/deno/^1.42.4)

<h1 align="center">
  🎯 dkill
</h1>

<p align="center">
  <b>kill processes identified by port in Deno 🦕</b>
</p>

## CLI Usage

### Install

```sh
deno install --global --force --allow-run --allow-net jsr:@sylc/dkill
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

## Programmatic Usage

mod.ts exports multiple functions that can be used programmatically. Check
source code for more info

See [docs](https://jsr.io/@sylc/dkill/doc)

## OS Support

- Windows: Windows 8 or above
- Linux: On linux the cmd `ss` is used, which works on ubuntu 16.04 and above.
- MacOS: The command `lsof` is used. Interactive mode and listing the exact
  command is currently not implemented

## Inspiration

- nodejs [fkill-cli](https://www.npmjs.com/package/fkill-cli)
