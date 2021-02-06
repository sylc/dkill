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
      .filter((arr) => arr.length !== 0) // filter last line
      .map((arr) => +arr[pidColumnsIndex]) // extract pids based on columns
      .filter((pid) => Number.isInteger(pid) && pid !== 0); // ensure they are numbers. port 0 can be ignored

    return [...new Set(pids)]; // remove duplicates;
  } else if (os === "linux") {
    console.log("Platform not supported yet");
    throw Error("Platform not supported yet");
  } else {
    console.log("Platform not supported yet");
    throw Error("Platform not supported yet");
  }
}
