import { Command } from "./dep.ts";
import { dkill } from "./mod.ts";

await new Command()
  .name("dkill")
  .version("0.1.0")
  .description(`Kill any process by 
     - port: add a semicolon in front to define it as a port. ex: dkill :3000
     - pid: not implemented yet
     - process name: not implemented yet`)
  .arguments("<pid_name_port>")
  .option("-v, --verbose", "increase verbosity")
  .action(async (opts: { verbose: boolean }, pid_name_port: string) => {
    if (pid_name_port.startsWith(":")) {
      const port = +pid_name_port.slice(1);
      if (!Number.isInteger(port)) {
        console.log(`Invalid port number "port"`);
        return;
      }
      await dkill({ type: "port", port }, opts.verbose);
    }
  })
  .parse(Deno.args);
