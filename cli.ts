import { Checkbox, Command } from "./deps.ts";
import { dkill } from "./mod.ts";
import { procList } from "./src/procList.ts";
import { upgrader } from "./src/upgrader.ts";
import { assertMinVersion } from "./src/utils/versions.ts";

import vJson from "./version.json" assert { type: "json" };

// check minimum version of deno
const minVRequired = "1.31.1"; // uses deno.Command
if (!assertMinVersion(Deno.version.deno, minVRequired)) {
  console.error(
    `Please upgrade deno. Minimum version required is: ${minVRequired}`,
  );
  Deno.exit(1);
}

await new Command()
  .name("dkill")
  .version(vJson.version)
  .description(
    `Kill any processes by 
     - port: Prefix port number by a colon. ex: 'dkill :3000'
     - pid: A valid integer. ex: 'dkill 12654'
     - process name: A string ex: 'dkill Code.exe'
     
    You can specify multiple targets at once: 'dkill node.exe :5000 :3000 164'`,
  )
  .arguments("<...targets>")
  .option("-i, --interactive", "Interactive mode (Not available on MacOS)", {
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
    async (opts, ...targets) => {
      if (opts.upgrade) {
        // upgrading version.
        await upgrader({
          packageName: "dkill",
          currentVersion: vJson.version,
          denoLand: true,
        });
        return;
      }

      const ports: number[] = [];
      const pids: number[] = [];
      const procs: string[] = [];

      if (opts.interactive) {
        if (Deno.build.os === "darwin") {
          console.error("Not implemented on macos");
          Deno.exit(1);
        }
        // list processes
        const pList = await procList();
        const pickedProcesses: string[] = await Checkbox.prompt({
          message: "Pick processes to kill",
          options: pList.map((item) => ({
            name: `${item.pid} | ${item.proc} | ${item.cmd}`,
            value: `${item.pid}`,
          })),
          search: true,
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
