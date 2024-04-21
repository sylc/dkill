import { procList } from "../mod.ts";
import type { PidItem } from "./utils/types.ts";

/**
 * Return Pids for a list of process names
 * @param {string[]} procs list of process names
 * @returns {Promise} Array of pid details
 */
export async function procToPid(procs: string[]): Promise<PidItem[]> {
  const os = Deno.build.os;

  let sanitizeProcs = procs;
  if (os === "windows") {
    // onwindows consider Proc with match Casing
    sanitizeProcs = procs.map((p) => p.toLocaleLowerCase());
  }
  const list = await procList();

  return list.filter((item) => sanitizeProcs.includes(item.proc));
}
