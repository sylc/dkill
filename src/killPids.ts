import { runCmd } from "./utils/runCmd.ts";

/**
 * Kill a pids
 * @param {number[]} pids 
 * @param {object} [opts]
 * @param {boolean} [opts.verbose]
 * @returns 
 */
export async function KillPids(pids: number[], opts?: { verbose?: boolean }) {
  const os = Deno.build.os;
  const pidKilled: number[] = [];

  // Ensure no duplicates.
  const uniqPids = [...new Set(pids)];

  for (const pid of uniqPids) {
    try {
      let cmdArr = [];
      if (os === "windows") {
        cmdArr = ["cmd", "/c", `taskkill /PID ${pid} /F`];
      } else if (os === "linux") {
        cmdArr = ["kill", "-9", `${pid}`];
      } else {
        throw Error("Platform not supported yet");
      }
      await runCmd(cmdArr, opts?.verbose);
      pidKilled.push(pid);
    } catch (err) {
      console.log(`Failed to kill pid ${pid}`);
      console.log(err);
    }
  }
  return pidKilled;
}
