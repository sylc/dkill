/**
 * Return the stdout of the command.
 * This does not throw if the code return is non zero.
 */
export async function runCmd(cmd: string[], verbose?: boolean) {
  verbose && console.log(cmd.join(" "));
  const [cmd1, ...cmd2] = cmd;

  const exec = new Deno.Command(cmd1, {
    args: cmd2,
    stderr: "inherit",
  });

  const { stdout } = await exec.output();
  return new TextDecoder().decode(stdout);
}
