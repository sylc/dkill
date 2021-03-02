async function fetchNewFlags(url: string) {
  const versionRes = await fetch(url);
  const versionText = await versionRes.text();

  const parsed = versionText.match(/denoFlags =[\s\S]*];/);
  if (!parsed) throw Error("Cannot parse flags");
  console.log(parsed[0].slice("denoFlags =".length, parsed[0].length - 1));
  const flags = JSON.parse(
    parsed[0].slice("denoFlags =".length, parsed[0].length - 1),
  );
  return flags;
}

export async function upgrader(config: {
  packageName: string;
  currentVersion: string;
  denoLand?: boolean;
  nestLand?: boolean;
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
  if (config.nestLand) {
    const res = await fetch("https://nest.land/api/package-client", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { name: config.packageName } }),
    });
    const info = await res.json();
    //   {
    //     "body": {
    //         "name": "dkill",
    //         "normalizedName": "dkill",
    //         "owner": "scau",
    //         "description": "Deno cli to kill processes and ports",
    //         "repository": "https://github.com/sylc/dkill",
    //         "latestVersion": "dkill@0.5.0",
    //         "latestStableVersion": "dkill@0.5.0",
    //         "packageUploadNames": [
    //             "dkill@0.2.0",
    //             "dkill@0.2.1",
    //             "dkill@0.2.2",
    //             "dkill@0.2.3",
    //             "dkill@0.3.0",
    //             "dkill@0.4.0",
    //             "dkill@0.5.0"
    //         ],
    //         "locked": null,
    //         "malicious": null,
    //         "unlisted": false,
    //         "updatedAt": "2021-02-21T06:06:18.931Z",
    //         "createdAt": "2021-02-06T12:40:59.473Z"
    //     }
    // }
    if (
      `${config.packageName}@${config.currentVersion}` !==
        info.body.latestVersion
    ) {
      const newFlags = await fetchNewFlags(
        `https://x.nest.land/${info.body.latestVersion}/version.ts`,
      );
      console.log(
        `nest.land: deno install -f ${
          newFlags.join(" ")
        } https://x.nest.land/${info.body.latestVersion}/cli.ts`,
      );
    } else {
      console.log("Already up to date from nest.land");
    }
  }
}
