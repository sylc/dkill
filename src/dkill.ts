import { KillPids, port2pid } from "../mod.ts";
import { setVerbose, verbose } from "./utils/verbose.ts";

export async function dkill(
  targets: {
    pids?: number[];
    ports?: number[];
    procs?: string[];
  },
  opts?: { verbose?: boolean; dryrun?: boolean },
) {
  setVerbose(opts?.verbose);

  const { pids, ports, procs } = targets;

  let allPidsToKill = pids || [];

  // Find Pids for ports
  if (ports && ports.length) {
    for (const port of ports) {
      const pidsOfPort = await port2pid(port);
      verbose(`pids for port ${port}: ${pidsOfPort}`);
      allPidsToKill = allPidsToKill.concat(pidsOfPort);
    }
  }

  // processes
  if (procs && procs.length) {
    console.log("Process name input not implemented yet");
    return;
  }

  // remove duplicates
  allPidsToKill = [...new Set(allPidsToKill)];

  // find names

  // Kill them all, or just pretend
  let killed = [];
  if (!opts?.dryrun) {
    killed = await KillPids(allPidsToKill);
  } else {
    killed = allPidsToKill;
  }

  if (killed.length) {
    console.log(
      `${opts?.dryrun ? "list of pids target (not killed):" : "pids killed:"}`,
      killed.join(" "),
    );
  } else {
    console.log("No process found");
  }
}
