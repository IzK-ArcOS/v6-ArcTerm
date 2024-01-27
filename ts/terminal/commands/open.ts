import { spawnApp } from "$ts/apps/spawn";
import { tryJsonConvert } from "$ts/json";
import { appLibrary } from "$ts/stores/apps";
import { AppSpawnResultCaptions } from "$ts/stores/apps/spawn";
import type { Command } from "../interface";

export const Spawn: Command = {
  keyword: "spawn",
  async exec(cmd, argv, term) {
    const id = argv[0];

    if (!id) return term.std.Error("Missing process ID.");

    argv.shift();

    const args = tryJsonConvert<any[]>(argv.join(" "));
    const library = appLibrary.get();

    if (!library.has(id)) return term.std.Error(`${id}: app not found.`);

    const pid = await spawnApp(id, 0, Array.isArray(args) ? args : []);

    if (typeof pid !== "number") {
      term.std.Error(`${pid}: ${AppSpawnResultCaptions[pid]}`);

      return;
    }

    term.std.Info(`Spawned [${library.get(id).metadata.name}] on PID [${pid}]`);
    term.vars.set("openpid", `${pid}`); // make the pid accessible for scripts
  },
  help(term) {
    term.std.writeColor("[NOTE]: Capitalization matters.", "yellow");
    term.std.writeColor("Example: [spawn] ArcTerm", "blue");
  },
  description: "Open a window",
  syntax: `"<[appId]>" (...[arguments])`,
};
