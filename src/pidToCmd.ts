import { procList } from "../mod.ts";
import { PidItem } from "./utils/types.ts";

export async function pidToCmd(pids: number[]): Promise<PidItem[]> {
  const list = await procList();

  return list.filter((item) => pids.includes(item.pid));
}
