async function winKill(pid: number) {
  const cmd = Deno.run({
    cmd: ["cmd", "/c", `taskkill /PID ${pid} /F`],
    stdout: "piped",
    stderr: "piped",
  });

  await cmd.output();

  cmd.close();
}

async function linuxKill(pid: number) {
  const cmd = Deno.run({
    cmd: ["kill", "-9", `${pid}`],
    stdout: "piped",
    stderr: "piped",
  });

  await cmd.output();

  cmd.close();
}

export async function KillPids(pids: number[]) {
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
