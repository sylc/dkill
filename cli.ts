import { Command } from "./dep.ts";
import { dkill } from "./mod.ts";

await new Command()
  .name("dkill")
  .version("0.1.0")
  .description(
    `Kill any process by 
     - ports: add a semicolon in front to define it as a port. ex: 'dkill :3000'
     - pids: not implemented yet
     - process names: not implemented yet`
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
      procs.push(port_proc_pid)
    }

    await dkill({ ports, pids, procs }, { verbose: opts.verbose });
  })
  .parse(Deno.args);
