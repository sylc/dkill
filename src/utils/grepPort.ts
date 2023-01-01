export const grepPortWindows = (rawLog: string) => {
  // outstring example
  // TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       28392
  const parsedLines = rawLog
    .split("\n")
    .map((line) => line.match(/\S+/g) || []);

  // parsedLines
  // [ [ "TCP", "0.0.0.0:3000", "0.0.0.0:0", "LISTENING", "28392" ], [] ]

  const pidColumnsIndex = 4;

  const pids = parsedLines
    .filter((arr) => arr.length !== 0) // filter last line
    .map((arr) => +arr[pidColumnsIndex]) // extract pids based on columns
    .filter((pid) => Number.isInteger(pid) && pid !== 0); // ensure they are numbers. pid 0 can be ignored
  return pids;
};

export const grepPortLinux = (rawLog: string, port: number) => {
  // outstring example
  // tcp LISTEN    0   128  0.0.0.0:8080   0.0.0.0:*   users:(("deno", pid=200, fd=12))
  const parsedLines = rawLog
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

  return pids;
};

export const grepPortMacOS = (rawLog: string) => {
  const parsedLines = rawLog.split("\n")
    .map((line) => line.match(/\S+/g) || []);

  const pidColumnsIndex = 1;

  // remove the headers
  parsedLines.shift();

  const pids = parsedLines
    .filter((arr) => arr.length !== 0) // filter invalid arrays
    .map((arr) => +arr[pidColumnsIndex]) // extract pids based on columns
    .filter((pid) => Number.isInteger(pid) && pid !== 0); // ensure they are numbers. pid 0 can be ignored

  return pids;
};
