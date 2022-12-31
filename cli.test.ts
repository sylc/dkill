import { assertNotEquals, delay } from "./deps_test.ts";

Deno.test("killing by pid", async () => {
  // create pid
  const pTest = Deno.run({
    cmd: ["sleep", "5000"],
  });

  // call dkill
  const pDkill = Deno.run({
    cmd: ["deno", "run", "-A", "./cli.ts", `${pTest.pid}`],
  });
  // wait dkill finishes
  await pDkill.status();

  // retreive status from test pid
  const status = await pTest.status();

  // close resources
  pTest.close();
  pDkill.close();

  assertNotEquals(status.code, 0);
});
Deno.test("killing by ports", async () => {
  // create a webserver
  const pTest1 = Deno.run({
    cmd: ["deno", "run", "-A", "./src/tests/utils.ts"],
  });
  const pTest2 = Deno.run({
    cmd: ["deno", "run", "-A", "./src/tests/utils.ts", "8081"],
  });


  // give time fo the webserver to start and the port be discoverable
  await delay(5000);

  // call dkill
  const pDkill = Deno.run({
    cmd: ["deno", "run", "-A", "./cli.ts", ":8080", ":8081"],
  });
  // wait dkill finishes
  await pDkill.status();

  // retrieve status from test pid
  const status1 = await pTest1.status();
  const status2 = await pTest2.status();

  // close resources
  pTest1.close();
  pTest2.close();

  pDkill.close();

  assertNotEquals(status1.code, 0);
  assertNotEquals(status2.code, 0);

});
