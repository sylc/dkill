export * from "./src/dkill.ts";
export * from "./src/killPids.ts";
export * from "./src/pidToCmd.ts";
export * from "./src/portToPid.ts";
export * from "./src/procList.ts";
export * from "./src/procToPid.ts";

import * as cli from "./cli.ts";

if (import.meta.main) {
  await cli.run();
}
