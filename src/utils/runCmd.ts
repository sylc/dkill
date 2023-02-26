export async function runCmd(cmd: string[], verbose?: boolean) {
  verbose && console.log(cmd.join(" "));
  const [cmd1, ...cmd2] = cmd;

  const exec = new Deno.Command(cmd1, {
    args: cmd2,
    stderr: "inherit",
  });

  const { code, stdout } = await exec.output();
  if (code !== 0) throw Error(`fail executing ${cmd.join(" ")}`);
  return new TextDecoder().decode(stdout);
}
