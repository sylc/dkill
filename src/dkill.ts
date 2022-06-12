import { KillPids, pidToCmd, portToPid, procToPid } from "../mod.ts";
import { setVerbose, verbose } from "./utils/verbose.ts";

interface PidToKill {
  pid: number;
  proc?: string;
  cmd?: string;
  port?: number;
  killed?: boolean;
}

/**
 * invoke dKill
 * @param {object} targets
 * @param {number[]} [targets.pids] array of pids
 * @param {number[]} [targets.ports] array of ports number
 * @param {string[]} [targets.procs] array of process names
 * @param {object} [opts] opts
 * @param {boolean} [opts.verbose] enable verbose
 * @param {boolean} [opts.dryrun] enable dryrun
 * @param {boolean} [opts.includeCmds] show commands that launched the process
 * @returns
 */
export async function dkill(
  targets: {
    pids?: number[];
    ports?: number[];
    procs?: string[];
  },
  opts?: { verbose?: boolean; dryrun?: boolean; includeCmds?: boolean },
) {
  setVerbose(opts?.verbose);

  const { pids, ports, procs } = targets;

  let allPidsToKill: PidToKill[] = [];
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
    const pidsOfProc = await procToPid(procs);
    allPidsToKill = allPidsToKill.concat(pidsOfProc);
  }

  // remove duplicates
  // TODO

  // find names
  if (opts?.includeCmds) {
    const cmds = await pidToCmd(
      allPidsToKill.filter((pidItem) => (!pidItem.proc || !pidItem.cmd)).map(
        (pidItem) => pidItem.pid,
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
    const killedPids = KillPids(
      allPidsToKill.map((pidItem) => pidItem.pid),
    );
    allPidsToKill = allPidsToKill.map((pidItem) => ({
      ...pidItem,
      killed: killedPids.includes(pidItem.pid),
    }));
  }

  return allPidsToKill;
}
