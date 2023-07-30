async function fetchNewFlags(url: string) {
  const versionRes = await fetch(url);
  const versionText = await versionRes.text();

  const parsed = versionText.match(/denoFlags =[\s\S]*];/);
  if (!parsed) throw Error("Cannot parse flags");
  const flags = JSON.parse(
    parsed[0].slice("denoFlags =".length, parsed[0].length - 1),
  );
  return flags;
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
  // it is unlikely to eb  > (not doing canary release)
  // so if not equal, it must be lower version
  if (config.currentVersion !== versions.latest) {
    const newFlags = await fetchNewFlags(
      `https://deno.land/x/${config.packageName}@${versions.latest}/version.ts`,
    );

    console.log(
      `Current version: ${config.currentVersion}; latest Version: ${versions.latest}`,
    );
    console.log("Run the below command to update:");
    console.log(
      `deno install -f ${
        newFlags.join(" ")
      } https://deno.land/x/${config.packageName}@${versions.latest}/cli.ts`,
    );
  } else {
    console.log(
      `Local version ${config.currentVersion} is the most recent release`,
    );
  }
}
