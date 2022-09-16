import { runCmd } from "./utils/runCmd.ts";
import { PidItem } from "./utils/types.ts";

/**
 * list all process running
 * @returns {Promise} Array of Pid infos
 */
export async function procList(): Promise<PidItem[]> {
  const os = Deno.build.os;

  const resultsObject: { [pid: string]: PidItem } = {};

  if (os === "windows") {
    const outJsonString = await runCmd([
      "powershell.exe",
      "Get-CimInstance Win32_Process | select processid,ProcessName,commandline | ConvertTo-Json",
    ]);

    const outJson: {
      processid: number;
      ProcessName: string;
      commandline: string;
    }[] = JSON.parse(outJsonString);
    outJson.forEach((item) => {
      resultsObject[item.processid] = {
        pid: item.processid,
        proc: item.ProcessName,
        cmd: item.commandline,
      };
    });
  } else if (os === "linux" || os === "darwin") {
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
      .map((arr) => {
        return { pid: +arr[0], proc: arr[3], cmd: "" };
      })
      .forEach((item) => {
        resultsObject[item.pid] = item;
      });

    // get Cmds
    const outStringCmd = await runCmd(["ps", "-eF"]);

    // outstring example
    // syl       494     8  0 1073831 25724 5 21:49 pts/0    00:00:00 deno run -A ./src/tests/utils.ts
    const parsedLinesCmd = outStringCmd
      .split("\n")
      .map((line) => line.match(/\S+/g) || []);

    // parsedLines
    // [ [ "syl", "494", "8", "0", "1073831","25724","5","21:49","pts/0","00:00:00","deno","run","-A","./src/tests/utils.ts" ], [] ]

    // remove first row of titles
    parsedLinesCmd.shift();

    parsedLinesCmd
      .filter((arr) => arr.length !== 0) // filter last line
      .map((arr) => {
        return { pid: +arr[1], cmd: arr.filter((_v, i) => i > 9).join(" ") }; // join the LAST columns starting at column 10
      })
      .forEach((item) => {
        resultsObject[item.pid] = { ...resultsObject[item.pid], cmd: item.cmd };
      });
  } else {
    throw Error("Platform not supported yet");
  }
  return Object.values(resultsObject);
}
