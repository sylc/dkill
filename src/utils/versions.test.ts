import { assert } from "https://deno.land/std@0.118.0/testing/asserts.ts";
import { assertMinVersion } from "./versions.ts";

Deno.test("assertMinVersion", () => {
  assert(assertMinVersion("1.1.5", "1.0.1"));
  assert(assertMinVersion("2.0.5", "1.0.1"));
  assert(!assertMinVersion("1.0.5", "2.0.0"));
});
