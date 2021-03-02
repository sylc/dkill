import { Checkbox, Command } from "./deps.ts";
import { dkill } from "./mod.ts";
import { procList } from "./src/procList.ts";
import { upgrader } from "./src/upgrader.ts";
import { version } from "./version.ts";

await new Command()
  .name("dkill")
  .version(version)
  .description(
    `Kill any processes by 
     - port: add a semicolon in front to define it as a port. ex: 'dkill :3000'
     - pid: a valid integer. ex: 'dkill 12654'
     - process name. ex: 'dkill Code.exe'
     
    You can specify multiple targets at once: 'dkill node.exe :5000 :3000 164'`,
  )
  .arguments("<targets...>")
  .option("-i, --interactive", "Interactive mode, only on linux", {
    standalone: true,
  })
  .option("-v, --verbose", "Increase verbosity")
  .option(
    "-d, --dryrun",
    "Dry run, List the pids that would have been killed. Does not kill anything",
  )
  .option(
    "-u, --upgrade",
    "Print out the command to upgrade if a new version is found. This will not process any other command",
    {
      standalone: true,
    },
  )
  .action(
    async (
      opts: {
        verbose: boolean;
        dryrun: boolean;
        upgrade: boolean;
        interactive: boolean;
      },
      targets: string[],
    ) => {
      if (opts.upgrade) {
        // upgrading version.
        await upgrader({
          packageName: "dkill",
          currentVersion: version,
          denoLand: true,
          nestLand: true,
        });
        return;
      }

      const ports: number[] = [];
      const pids: number[] = [];
      const procs: string[] = [];

      if (opts.interactive) {
        if (Deno.build.os === "windows") {
          console.warn(
            "** On windows, this is not working nicely because deno does not output correctly unicode. ** ",
          );
          console.warn("For selecting, use letter u and d");
        }
        // list processes
        const pList = await procList();
        const pickedProcesses: string[] = await Checkbox.prompt({
          message: "Pick some processes",
          options: pList.map((item) => ({
            name: `${item.pid} | ${item.proc} | ${item.cmd}`,
            value: `${item.pid}`,
          })),
        });
        pickedProcesses.forEach((p) => pids.push(+p));
      } else {
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
      }
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
