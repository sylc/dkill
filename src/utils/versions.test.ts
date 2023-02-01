import { assert } from "../../deps_test.ts";
import { assertMinVersion } from "./versions.ts";

Deno.test("assertMinVersion", () => {
  // should be good
  assert(assertMinVersion("1.1.5", "1.0.1"));
  assert(assertMinVersion("2.0.5", "1.0.1"));
  assert(assertMinVersion("1.30.0", "1.29.1"));
  // not good
  assert(!assertMinVersion("1.0.5", "2.0.0"));
  assert(!assertMinVersion("1.27.5", "1.30.0"));
});
