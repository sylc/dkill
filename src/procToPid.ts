import { procList } from "../mod.ts";
import { PidItem } from "./utils/types.ts";

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
