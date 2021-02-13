import { Command } from "./deps.ts";
import { dkill } from "./mod.ts";
import { version } from "./version.ts";

await new Command()
  .name("dkill")
  .version(version)
  .description(
    `Kill any processes by 
     - port: add a semicolon in front to define it as a port. ex: 'dkill :3000'
     - pid: a valid integer. ex: 'dkill 12654'
     - process name: not implemented yet
     
    You can specify multiple targets at once: 'dkill :5000 :3000 164'`,
  )
  .arguments("<targets...:string>")
  .option("-v, --verbose", "Increase verbosity")
  .option(
    "-d, --dryrun",
    "Dry run, List the pids that would have been killed. Does not kill anything",
  )
  .action(
    async (opts: { verbose: boolean; dryrun: boolean }, targets: string[]) => {
      const ports: number[] = [];
      const pids: number[] = [];
      const procs: string[] = [];

      targets.forEach((target) => {
        // Check if port
        if (target.startsWith(":")) {
          const port = +target.slice(1);
          if (!Number.isInteger(port)) {
            console.log(`Invalid port number "port"`);
            return;
          }
          ports.push(port);
        } else if (Number.isInteger(+target)) {
          // check if pid
          pids.push(+target);
        } else {
          // must be a string
          procs.push(target);
        }
      });

      const killed = await dkill(
        { ports, pids, procs },
        {
          verbose: opts.verbose,
          dryrun: opts.dryrun,
          includeCmds: true,
        },
      );

      if (killed && killed.length) {
        // TODO improve table output
        // console.table(killed.map(pidItem => ({ ...pidItem, port: `:${pidItem.port}`, killed: pidItem.killed ? 'yes' : 'x'})));
        console.table(killed);
        opts?.dryrun && console.log("Nothing has been killed");
      } else {
        console.log("No process found");
      }
    },
  )
  .parse(Deno.args);
