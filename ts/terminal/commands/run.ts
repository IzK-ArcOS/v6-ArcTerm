import { getPartialFile } from "$ts/server/fs/file";
import { OpenFile } from "$ts/server/fs/file/handler";
import type { Command } from "../interface";

export const Open: Command = {
  keyword: "open",
  async exec(cmd, argv, term) {
    const fn = argv.join(" ").trim();
    const partial = await getPartialFile(`${term.path}/${fn}`)

    if (!partial) return term.std.Error(`Can't find file [${fn}]!`);

    await OpenFile(partial);

    term.std.Info(`Opened [${fn}] (${partial.size} bytes)`)
  },
  help(term) {
    term.std.writeColor("[NOTE]: Capitalization matters.", "yellow");
    term.std.writeColor("Example: [open] arcterm.conf", "blue");
  },
  description: "Run a file from your ArcFS account.",
  syntax: `"<[filename]>"`,
};
