import { assertEquals } from "../../deps_test.ts";
import { grepPortMacOS, grepPortWindows } from "./grepPort.ts";

Deno.test("assertMinVersion", () => {
  // windows
  const outw =
    "TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       28392";
  assertEquals(grepPortWindows(outw), [28392]);

  // macOS
  const outmac =
    `COMMAND  PID   USER     FD   TYPE                         DEVICE SIZE/OFF NODE NAME
    deno     1407  runner   13u  IPv4 0x85fdd397dc6713cf      0t0  TCP *:8081 (LISTEN)`;
  assertEquals(grepPortMacOS(outmac), [1407]);
});
