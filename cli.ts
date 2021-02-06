import { Command } from "./deps.ts";
import { dkill } from "./mod.ts";
import { version } from "./version.ts";

await new Command()
  .name("dkill")
  .version(version)
  .description(
    `Kill any process by 
     - port: add a semicolon in front to define it as a port. ex: 'dkill :3000'
     - pid: a valid integer. ex: 'dkill 12654'
     - process name: not implemented yet`,
  )
  .arguments("<port_proc_pid>")
  .option("-v, --verbose", "increase verbosity")
  .action(async (opts: { verbose: boolean }, port_proc_pid: string) => {
    const ports: number[] = [];
    const pids: number[] = [];
    const procs: string[] = [];

    // Check if port
    if (port_proc_pid.startsWith(":")) {
      const port = +port_proc_pid.slice(1);
      if (!Number.isInteger(port)) {
        console.log(`Invalid port number "port"`);
        return;
      }
      ports.push(port);
    } else if (Number.isInteger(+port_proc_pid)) {
      // check if pid
      pids.push(+port_proc_pid);
    } else {
      // must be a string
      procs.push(port_proc_pid);
    }

    await dkill({ ports, pids, procs }, { verbose: opts.verbose });
  })
  .parse(Deno.args);
