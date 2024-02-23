async function fetchNewCommand(version: string) {
  const readMeRes = await fetch(
    `https://jsr.io/@sylc/dkill/${version}/README.md`,
  );
  const readmeText = await readMeRes.text();

  const parsed = readmeText.match(/deno install .*/);
  if (!parsed || parsed.length === 0) throw Error("Cannot parse new command");
  return parsed[0];
}

export async function upgrader(config: {
  packageName: string;
  currentVersion: string;
}) {
  // try to find the latest version
  console.log("Looking up latest version");
  const versions = await (
    await fetch(
      `https://cdn.deno.land/${config.packageName}/meta/versions.json`,
    )
  ).json();
  // We do not consider the < comparison because
  // it is unlikely to be > (not doing canary release)
  // so if not equal, it must be lower version
  // TODO: use @std/semver
  if (config.currentVersion !== versions.latest) {
    // retrieve command from new version
    // const command = await fetchNewCommand(versions.latest);
    const command = await fetchNewCommand("0.10.1");
    console.log("A new version is available. Run the below command to update:");
    console.log(command);
  } else {
    console.log(
      `Local version ${config.currentVersion} is the most recent release`,
    );
  }
}
