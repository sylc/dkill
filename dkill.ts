import { KillPids, port2pid } from "./mod.ts";

type KillTarget = {
  type: "port";
  port: number;
} | {
  type: "name";
  name: string;
} | {
  type: "pid";
  pid: number;
};

export async function dkill(killTarget: KillTarget, verbose = false) {
  let pids: number[];
  switch (killTarget.type) {
    case "port":
      console.log("Killing port", killTarget.port);
      pids = await port2pid(killTarget.port);
      await KillPids(pids);
      console.log("pid Killed", pids);
      break;
    case "pid":
      pids = [killTarget.pid];
      await KillPids(pids);
      break;
    case "name":
      console.log("Not Implemented");
      return;
  }
  console.log("pid Killed", pids);
}
