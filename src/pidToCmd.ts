import { procList } from "../mod.ts";
import type { PidItem } from "./utils/types.ts";

/**
 * Get the command that started a pid
 * @param {number[]} pids array of pids number
 * @returns {Promise} Array of Pids info
 */
export async function pidToCmd(pids: number[]): Promise<PidItem[]> {
  const list = await procList();

  return list.filter((item) => pids.includes(item.pid));
}
