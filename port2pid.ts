export async function port2pid(port: number): Promise<number[]> {
  const os = Deno.build.os;
  if (os === "windows") {
    const cmd = Deno.run({
      cmd: ["cmd", "/c", `netstat -nao | findstr :${port}`],
      stdout: "piped",
      stderr: "piped",
    });

    const out = await cmd.output();
    const outString = new TextDecoder().decode(out);
    // outstring example
    // TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       28392
    const parsedLines = outString
      .split("\n")
      .map((line) => line.match(/\S+/g) || []);

    // parsedLines
    // [ [ "TCP", "0.0.0.0:3000", "0.0.0.0:0", "LISTENING", "28392" ], [] ]

    const pidColumnsIndex = 4;

    cmd.close();
    const pids = parsedLines
      .filter((arr) => arr.length !== 0)
      .map((arr) => +arr[pidColumnsIndex])
      .filter((pid) => Number.isInteger(pid));

      console.log(pids)
    return pids;
  } else if (os === "linux") {
    console.log("Unsupported platform");
    throw Error("Unsupported platform");
  } else {
    console.log("Unsupported platform");
    throw Error("Unsupported platform");
  }
}
