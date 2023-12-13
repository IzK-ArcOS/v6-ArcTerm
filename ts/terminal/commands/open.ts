import { spawnProcess } from "$ts/apps/process";
import { tryJsonConvert } from "$ts/json";
import { appLibrary } from "$ts/stores/apps";
import type { Command } from "../interface";

export const Open: Command = {
  keyword: "open",
  exec(cmd, argv, term) {
    const id = argv[0];

    if (!id) return term.std.Error("Missing process ID.");

    const library = appLibrary.get();

    if (!library[id]) return term.std.Error(`${id}: app not found.`);

    spawnProcess(id);

    term.std.writeColor(`Opened [${library[id].metadata.name}]`, "purple");
  },
  help(term) {
    term.std.writeColor("[NOTE]: Capitalization matters.", "yellow");
    term.std.writeColor("Example: [open] ArcTerm", "blue");
  },
  description: "Open a window",
  syntax: `"<[appId]>"`,
};
