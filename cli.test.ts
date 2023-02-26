import { assertEquals, assertNotEquals, delay } from "./deps_test.ts";

Deno.test("killing by pid", async () => {
  // create test process
  const command = new Deno.Command("sleep", {
    args: [
      "5000",
    ],
  });
  const pTest = command.spawn();
  await delay(100);

  const pKill = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "-A",
      "./cli.ts",
      `${pTest.pid}`,
    ],
  });
  const { code } = await pKill.output();

  // retreive status from test pid
  const status = await pTest.status;

  // ensure dkill existed cleanly
  assertEquals(code, 0);
  assertNotEquals(status.code, 0);
});

Deno.test({
  name: "killing by ports",
  fn: async () => {
    // create 2 webservers
    const pTest1Cmd = new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "-A",
        "./src/tests/utils.ts",
      ],
    });

    const pTest2Cmd = new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "-A",
        "./src/tests/utils.ts",
        "8081",
      ],
    });
    const pTest1 = pTest1Cmd.spawn();
    const pTest2 = pTest2Cmd.spawn();

    // give time fo the webserver to start and the port be discoverable
    await delay(5000);

    // call dkill
    const pDkillCmd = new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "-A",
        "--unstable",
        "./cli.ts",
        "--verbose",
        ":8080",
        ":8081",
      ],
    });

    // wait dkill finishes
    const { code } = await pDkillCmd.output();
    // ensure dkill exited cleanly
    assertEquals(code, 0);

    // retrieve status from test pid
    const status1 = await pTest1.status;
    const status2 = await pTest2.status;

    assertNotEquals(status1.code, 0);
    assertNotEquals(status1.code, 5); // check it wasn't a timeout
    assertNotEquals(status2.code, 0);
    assertNotEquals(status2.code, 5);
  },
});
