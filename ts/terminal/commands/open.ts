import { spawnApp } from "$ts/apps/spawn";
import { tryJsonConvert } from "$ts/json";
import { appLibrary } from "$ts/stores/apps";
import type { Command } from "../interface";

export const Open: Command = {
  keyword: "open",
  exec(cmd, argv, term) {
    const id = argv[0];

    if (!id) return term.std.Error("Missing process ID.");

    argv.shift();

    console.log(argv)

    const args = tryJsonConvert<any[]>(argv.join(" "));
    const library = appLibrary.get();

    if (!library.has(id)) return term.std.Error(`${id}: app not found.`);

    spawnApp(id, term.pid, Array.isArray(args) ? args : []);

    term.std.writeColor(`Opened [${library.get(id).metadata.name}]`, "purple");
  },
  help(term) {
    term.std.writeColor("[NOTE]: Capitalization matters.", "yellow");
    term.std.writeColor("Example: [open] ArcTerm", "blue");
  },
  description: "Open a window",
  syntax: `"<[appId]>" (...[arguments])`,
};
