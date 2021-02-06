import { KillPids, port2pid } from "../mod.ts";

export async function dkill(
  targets: {
    pids?: number[];
    ports?: number[];
    procs?: string[];
  },
  opts?: { verbose?: boolean },
) {
  let pidsKilled: number[] = [];

  function verbose(text: string) {
    opts?.verbose ? console.log(text) : null;
  }

  const { pids, ports, procs } = targets;

  // pids
  if (pids && pids.length) {
    const killed = await KillPids(pids);
    pidsKilled = pidsKilled.concat(killed);
  }

  // ports
  if (ports && ports.length) {
    let pidsOfAllPorts: number[] = [];
    for (const port of ports) {
      const pidsOfPort = await port2pid(port);
      verbose(`pids for port ${port}: ${pidsOfPort}`);
      pidsOfAllPorts = pidsOfAllPorts.concat(pidsOfPort);
    }
    const killed = await KillPids(pidsOfAllPorts);
    pidsKilled = pidsKilled.concat(killed);
  }

  // processes
  if (procs && procs.length) {
    console.log("Process name input not implemented yet");
    return;
  }

  if (pidsKilled.length) {
    console.log("pids Killed", pidsKilled);
  } else {
    console.log("No process found");
  }
}
