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
  denoLand?: boolean;
}) {
  // try to find the install script
  console.log("Run ONE of the below commands");
  if (config.denoLand) {
    const versions = await (
      await fetch(
        `https://cdn.deno.land/${config.packageName}/meta/versions.json`,
      )
    ).json();
    if (config.currentVersion !== versions.latest) {
      const newFlags = await fetchNewFlags(
        `https://deno.land/x/${config.packageName}@${versions.latest}/version.ts`,
      );
      console.log(
        `deno.land: deno install -f ${
          newFlags.join(" ")
        } https://deno.land/x/${config.packageName}@${versions.latest}/cli.ts`,
      );
    } else {
      console.log("Already up to date from deno.land");
    }
  }
}
