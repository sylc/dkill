export async function runCmd(cmd: string[], verbose?: boolean) {
  verbose && console.log(cmd.join(" "));
  const exec = Deno.run({
    cmd,
    stdout: "piped",
    stderr: "piped",
  });

  const out = await exec.output();
  exec.close();
  return new TextDecoder().decode(out);
}
