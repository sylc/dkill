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

    // outstring example
    // TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       28392
    const parsedLines = outString
      .split("\n")
      .map((line) => line.match(/\S+/g) || []);

    // parsedLines
    // [ [ "TCP", "0.0.0.0:3000", "0.0.0.0:0", "LISTENING", "28392" ], [] ]

    const pidColumnsIndex = 4;

    const pids = parsedLines
      .filter((arr) => arr.length !== 0) // filter last line
      .map((arr) => +arr[pidColumnsIndex]) // extract pids based on columns
      .filter((pid) => Number.isInteger(pid) && pid !== 0); // ensure they are numbers. pid 0 can be ignored

    return [...new Set(pids)]; // remove duplicates;
  } else if (os === "linux") {
    // -l: listening
    // -p: provide pid
    // -n: provide local address
    const outString = await runCmd(["ss", "-lnp"]);

    // outstring example
    // tcp LISTEN    0   128  0.0.0.0:8080   0.0.0.0:*   users:(("deno", pid=200, fd=12))
    const parsedLines = outString
      .split("\n")
      .map((line) => line.match(/\S+/g) || []);

    // parsedLines
    // [ [ "LISTEN", "0", "128", "0.0.0.0:8080", "0.0.0.0:*", users:(("deno", pid=200, fd=12)) ], [] ]

    const portColumnIndex = 4;
    const pidColumnsIndex = 6;

    // remove first row of titles
    parsedLines.shift();

    const pids = parsedLines
      .filter((arr) => arr.length !== 0) // filter last line
      .filter((arr) => {
        const localAddrArr = arr[portColumnIndex].split(":");
        return localAddrArr.length > 0 ? +localAddrArr[1] === port : false;
      }) // filter connection for the targetted port
      .map((arr) => {
        // arr[pidColumnsIndex] should be like:
        // users:(("deno", pid=200, fd=12))
        const strArr = arr[pidColumnsIndex].match(/pid=(.*?),/);
        if (!strArr) {
          console.log("Line with issues", arr);
          throw Error("Invalid parsing");
        }
        return +strArr[1];
      }) // extract pids based on columns
      .filter((pid) => Number.isInteger(pid) && pid !== 0); // ensure they are numbers. pid 0 can be ignored

    return [...new Set(pids)]; // remove duplicates;
  } else if (os === "darwin") {
    // console.log("1##############")
    // console.log(await runCmd(["lsof"]))
    // console.log("2##############")
    // console.log(await runCmd(["lsof", "-i", "-P"]))
    // console.log("3##############")
    const outString = await runCmd(["lsof", "-n", "-t", "-P", `-i:${port}`]);
    console.log("4##############");
    console.log(outString);
    // throw Error('tets')
    const res = outString.split("\n").map((str) => +str);
    console.log('res', res)
    return res
  } else {
    console.log("Platform not supported yet");
    throw Error("Platform not supported yet");
  }
}
