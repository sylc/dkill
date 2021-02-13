import { runCmd } from "./utils/runCmd.ts";

export async function KillPids(pids: number[], opts?: { verbose?: boolean }) {
  const os = Deno.build.os;
  const pidKilled: number[] = [];

  // Ensure no duplicates.
  const uniqPids = [...new Set(pids)];

  for (const pid of pids) {
    try {
      if (os === "windows") {
        const cmdArr = ["cmd", "/c", `taskkill /PID ${pid} /F`];
        await runCmd(cmdArr, opts?.verbose);
        pidKilled.push(pid);
      } else if (os === "linux") {
        const cmdArr = ["kill", "-9", `${pid}`];
        await runCmd(cmdArr, opts?.verbose);
        pidKilled.push(pid);
      } else {
        console.log("Platform not supported yet");
        throw Error("Platform not supported yet");
      }
    } catch (err) {
      console.log(`Failed to kill pid ${pid}`);
      console.log(err);
    }
  }
  return pidKilled;
}
