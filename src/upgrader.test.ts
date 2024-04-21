import { assert } from "../deps_test.ts";
import { upgrader } from "./upgrader.ts";

Deno.test("upgrader", async () => {
  const res = await upgrader({ packageName: "dkill", currentVersion: "0.0.0" });
  assert(res.includes("deno install"));
});
