import { publish } from "https://x.nest.land/eggs@0.3.4/src/commands/publish.ts";
import { version } from "../version.ts";

const config = {
  name: "dkill",
  description: "Deno cli to kill processes by pid and ports",
  version,
  entry: "./mod.ts",
  homepage: "https://github.com/sylc/dkill",
  unstable: true,
  unlisted: false,
  files: [
    "./mod.ts",
    "./src/**/*",
    "./README.md",
    "./deps.ts",
    "./cli.ts",
    "./version.ts",
    "./LICENSE",
  ],
  ignore: [".git", ".vscode", ".release"],
  checkFormat: "deno fmt",
  checkTests: "deno test",
  checkInstallation: true,
  check: false,
};

publish(config, "dkill");
