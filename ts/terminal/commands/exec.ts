import { readDirectory } from "$ts/server/fs/dir";
import { UserDirectory } from "$types/fs";
import type { Command } from "../interface";

export const Exec: Command = {
  keyword: "exec",
  async exec(cmd, argv, term) {
    const path = term.path as string;
    const fn = argv.join(" ").trim();
    const dir = (await readDirectory(path)) as UserDirectory;

    for (const file of dir.files) {
      if (file.filename != fn) continue;

      await term.scripts.runScriptFile(file.scopedPath);
    }
  },
  help(term) {
    term.std.writeColor("[NOTE]: Capitalization matters.", "yellow");
    term.std.writeColor("Example: [exec] mwomp.txt", "blue");
  },
  description: "Execute ArcTerm commands from a file",
  syntax: "<[filename]>",
};
