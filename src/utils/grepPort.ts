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
