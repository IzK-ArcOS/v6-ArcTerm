import { readDirectory } from "$ts/server/fs/dir";
import { UserDirectory } from "$types/fs";
import type { Command } from "../interface";
import type { ArcTerm } from "../main";

export const Cd: Command = {
  keyword: "cd",
  async exec(cmd, argv, term) {
    const cwd = term.path.endsWith("/") ? term.path.slice(0, -1) : term.path;
    const newPath = argv.join(" ");
    const path = `${cwd}/${newPath}`;

    if (newPath == "/") return (term.path = "./");

    const directory = await readDirectory(path);

    if (!directory) {
      return err(term, path);
    }

    const dir = directory as UserDirectory;

    if (dir.scopedPath.includes("..")) return err(term, path);

    term.path = dir.scopedPath;
  },
  help(term) {
    term.std.writeColor("[NOTE]: Capitalization matters.", "yellow");
    //term.std.writeLine("Change the directory to the specified relative path.\n\n");
    term.std.writeColor("Example: [cd] ../Documents", "blue");
  },
  description: "Change directory",
  syntax: "[<path>]",
};

function err(t: ArcTerm, p: string) {
  return t.std.Error(`Can't change to "${p}": Path not found`);
}
