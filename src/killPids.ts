/**
 * Kill a pids
 * @param {number[]} pids
 * @param {object} [opts]
 * @param {boolean} [opts.verbose]
 * @returns
 */
export function KillPids(pids: number[], opts?: { verbose?: boolean }) {
  const pidKilled: number[] = [];

  // Ensure no duplicates.
  const uniqPids = [...new Set(pids)];

  for (const pid of uniqPids) {
    try {
      if (opts?.verbose) console.log(`Killing ${pid} ...`);
      Deno.kill(pid, "SIGKILL");
      pidKilled.push(pid);
    } catch (err) {
      console.log(`Failed to kill pid ${pid}`);
      console.log(err);
    }
  }
  return pidKilled;
}
