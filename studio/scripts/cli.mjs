import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
const require = createRequire(import.meta.url);
const cli = join(
  dirname(require.resolve("sanity/package.json")),
  "bin",
  "sanity",
);
const env = { ...process.env, NO_UPDATE_NOTIFIER: "1", DO_NOT_TRACK: "1" };
// Use a disposable config directory for unauthenticated builds; editor login uses normal config.
if (process.argv[2] === "build" && !env.XDG_CONFIG_HOME)
  env.XDG_CONFIG_HOME = join(tmpdir(), "honabbas-sanity-build");
const child = spawn(process.execPath, [cli, ...process.argv.slice(2)], {
  stdio: "inherit",
  env,
});
child.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on("exit", (code) => (process.exitCode = code ?? 1));
