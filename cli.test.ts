import { assertEquals, assertNotEquals, delay } from "./deps_test.ts";

Deno.test("killing by pid", async () => {
  // create pid
  const pTest = Deno.run({
    cmd: ["sleep", "5000"],
  });

  // call dkill
  const pDkill = Deno.run({
    cmd: ["deno", "run", "-A", "--unstable", "./cli.ts", `${pTest.pid}`],
  });
  // wait dkill finishes
  const cliStatus = await pDkill.status();

  // retreive status from test pid
  const status = await pTest.status();

  // close resources
  pTest.close();
  pDkill.close();

  // ensure dkill existed cleanly
  assertEquals(cliStatus.code, 0);
  assertNotEquals(status.code, 0);
});
Deno.test("killing by port", async () => {
  // create a webserver
  const pTest = Deno.run({
    cmd: ["deno", "run", "-A", "--unstable", "./src/tests/utils.ts"],
  });

  // give time fo the webserver to start and the port be discoverable
  await delay(5000);

  // call dkill
  const pDkill = Deno.run({
    cmd: ["deno", "run", "-A", "--unstable", "./cli.ts", "--verbose", ":8080"],
  });
  // wait dkill finishes
  const cliStatus = await pDkill.status();
  pDkill.close();
  // ensure dkill existed cleanly
  assertEquals(cliStatus.code, 0);

  // retrieve status from test pid
  const status = await pTest.status();
  // close resources
  pTest.close();

  assertNotEquals(status.code, 0);
});
