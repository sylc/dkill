import {
  grepPortLinux,
  grepPortMacOS,
  grepPortWindows,
} from "./utils/grepPort.ts";
import { runCmd } from "./utils/runCmd.ts";

/**
 * Find the pids using a given port
 * @param {number} port
 * @returns {Promise} array of pid
 */

export async function portToPid(port: number): Promise<number[]> {
  const os = Deno.build.os;
  if (os === "windows") {
    const outString = await runCmd([
      "cmd",
      "/c",
      `netstat -nao | findstr :${port}`,
    ]);

    const pids = grepPortWindows(outString);

    return [...new Set(pids)]; // remove duplicates;
  } else if (os === "linux") {
    // -l: listening
    // -p: provide pid
    // -n: provide local address
    const outString = await runCmd(["ss", "-lnp"]);

    const pids = grepPortLinux(outString, port);

    return [...new Set(pids)]; // remove duplicates;
  } else if (os === "darwin") {
    const outString = await runCmd(["lsof", "-nwP", `-iTCP:${port}`]);

    // COMMAND  PID   USER     FD   TYPE                         DEVICE SIZE/OFF NODE NAME
    // deno     1407  runner   13u  IPv4 0x85fdd397dc6713cf      0t0  TCP *:8081 (LISTEN)
    const pids = grepPortMacOS(outString);

    return [...new Set(pids)]; // remove duplicates;
  } else {
    console.log("Platform not supported yet");
    throw Error("Platform not supported yet");
  }
}
