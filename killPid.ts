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
  let count = 0;
  for (const pid of pids) {
    try {
      if (os === "windows") {
        await winKill(pid);
      } else if (os === "linux") {
        await linuxKill(pid);
      } else {
        console.log("Unsupported platform");
        throw Error("Unsupported platform");
      }
      count += 1;
    } catch (err) {
      console.log(`Failed to kill pid ${pid}`);
      console.log(err);
    }
  }
  return count;
}
