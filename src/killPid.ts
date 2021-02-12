import { setVerbose, verbose } from "./utils/verbose.ts";

async function winKill(pid: number) {
  const cmdArr = ["cmd", "/c", `taskkill /PID ${pid} /F`]
  verbose(cmdArr.join(' '))
  const cmd = Deno.run({
    cmd: cmdArr,
    stdout: "piped",
    stderr: "piped",
  });

  await cmd.output();

  cmd.close();
}

async function linuxKill(pid: number) {
  const cmdArr = ["kill", "-9", `${pid}`]
  verbose(cmdArr.join(' '))
  const cmd = Deno.run({
    cmd: cmdArr,
    stdout: "piped",
    stderr: "piped",
  });

  await cmd.output();

  cmd.close();
}

export async function KillPids(pids: number[], opts?: { verbose?: boolean }) {
  setVerbose(opts?.verbose)
  const os = Deno.build.os;
  const pidKilled: number[] = [];
  
  for (const pid of pids) {
    try {
      if (os === "windows") {
        await winKill(pid);
        pidKilled.push(pid);
      } else if (os === "linux") {
        await linuxKill(pid);
        pidKilled.push(pid);
      } else {
        console.log("Platform not supported yet");
        throw Error("Platform not supported yet");
      }
    } catch (err) {
      console.log(`Failed to kill pid ${pid}`);
      console.log(err);
    }
  }
  return pidKilled;
}
