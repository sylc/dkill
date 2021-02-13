import { runCmd } from "./utils/runCmd.ts";

interface CmdItem {
  pid: number;
  proc: string;
  cmd: string;
}

export async function pidToCmd(pids: number[]): Promise<CmdItem[]> {
  const os = Deno.build.os;

  const resultsObject: { [pid: string]: CmdItem } = {};

  if (os === "windows") {
    console.log("Platform not supported yet");
    throw Error("Not implemented yet");
  } else if (os === "linux") {
    // const outString = await runCmd(['ps', `-o comm,command --no-header -p ${pids.join(' ')}`]);
    // For some reason the above command return empty,
    // while the below is working.

    // get Procs
    const outStringProc = await runCmd(["ps", "-e"]);

    // outstring example
    // 494 pts/0    00:00:00 deno
    const parsedLinesProc = outStringProc
      .split("\n")
      .map((line) => line.match(/\S+/g) || []);

    // parsedLines
    // [ [ "494", "pts/0", "00:00:00", "deno" ], [] ]

    // remove first row of titles
    parsedLinesProc.shift();

    parsedLinesProc
      .filter((arr) => arr.length !== 0) // filter last line
      .filter((arr) => {
        return pids.includes(+arr[0]);
      }) // filter connection for the targetted port
      .map((arr) => {
        return { pid: +arr[0], proc: arr[3], cmd: "" };
      })
      .forEach((item) => {
        resultsObject[item.pid] = item;
      });

    // get Cmds
    const outStringCmd = await runCmd(["ps", "-eF"]);

    // outstring example
    // scau       494     8  0 1073831 25724 5 21:49 pts/0    00:00:00 deno run -A ./src/tests/utils.ts
    const parsedLinesCmd = outStringCmd
      .split("\n")
      .map((line) => line.match(/\S+/g) || []);

    // parsedLines
    // [ [ "scau", "494", "8", "0", "1073831","25724","5","21:49","pts/0","00:00:00","deno","run","-A","./src/tests/utils.ts" ], [] ]

    // remove first row of titles
    parsedLinesCmd.shift();

    parsedLinesCmd
      .filter((arr) => arr.length !== 0) // filter last line
      .filter((arr) => {
        return pids.includes(+arr[1]);
      }) // filter connection for the targetted port
      .map((arr) => {
        return { pid: +arr[1], cmd: arr.filter((_v, i) => i > 9).join(" ") };
      })
      .forEach((item) => {
        resultsObject[item.pid] = { ...resultsObject[item.pid], cmd: item.cmd };
      });
  } else {
    console.log("Platform not supported yet");
    throw Error("Platform not supported yet");
  }
  return Object.values(resultsObject);
}
