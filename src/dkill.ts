import { KillPids, pidToCmd, portToPid } from "../mod.ts";
import { setVerbose, verbose } from "./utils/verbose.ts";

interface PidItem {
  pid: number;
  proc?: string;
  cmd?: string;
  port?: number;
  killed?: boolean;
}

export async function dkill(
  targets: {
    pids?: number[];
    ports?: number[];
    procs?: string[];
  },
  opts?: { verbose?: boolean; dryrun?: boolean; includeCmds: boolean },
) {
  setVerbose(opts?.verbose);

  const { pids, ports, procs } = targets;

  let allPidsToKill: PidItem[] = [];
  pids?.forEach((pid) => {
    allPidsToKill.push({ pid });
  });

  // Find Pids for ports
  if (ports && ports.length) {
    for (const port of ports) {
      const pidsOfPort = await portToPid(port);
      verbose(`pids for port ${port}: ${pidsOfPort}`);
      allPidsToKill = allPidsToKill.concat(
        pidsOfPort.map((pid) => ({ pid, port })),
      );
    }
  }

  // processes
  if (procs && procs.length) {
    console.log("Process name input not implemented yet");
    return;
  }

  // find names
  if (opts?.includeCmds) {
    const cmds = await pidToCmd(
      allPidsToKill.filter((pidItem) => (!pidItem.proc || !pidItem.cmd)).map(
        (pidItem) => pidItem.pid
      ),
    );
    // merge results
    allPidsToKill = allPidsToKill.map((pidItem) => {
      const item = cmds.find((cmdItem) => cmdItem.pid === pidItem.pid);
      return { ...pidItem, ...item };
    });
  }

  // Kill them all, or just pretend
  allPidsToKill = allPidsToKill.map((pidItem) => ({
    ...pidItem,
    killed: false,
  }));
  if (!opts?.dryrun) {
    const killedPids = await KillPids(
      allPidsToKill.map((pidItem) => pidItem.pid),
    );
    allPidsToKill = allPidsToKill.map((pidItem) => ({
      ...pidItem,
      killed: killedPids.includes(pidItem.pid),
    }));
  }

  return allPidsToKill;
}
