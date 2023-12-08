import { arrayToText } from "$ts/server/fs/convert";
import { readDirectory } from "$ts/server/fs/dir";
import { readFile } from "$ts/server/fs/file";
import { UserDirectory } from "$types/fs";
import type { Command } from "../interface";

export const Rf: Command = {
  keyword: "rf",
  async exec(cmd, argv, term) {
    const path = term.path as string;
    const fn = argv.join(" ").trim();
    const dir = (await readDirectory(path)) as UserDirectory;

    if (!dir) return term.std.Error("Could not read the current directory!");

    for (let i = 0; i < dir.files.length; i++) {
      const partial = dir.files[i];

      if (partial.filename == fn) {
        const file = await readFile(partial.scopedPath);

        if (!file) return term.std.Error("Could not read the file.");

        if (!partial.mime.includes("text/"))
          return term.std.Error("Not attempting to read non-text file.");

        const d = arrayToText(file.data);

        term.std.writeLine(d);

        return;
      }
    }

    term.std.Error(`The file doesn't exist on ArcFS.`);
  },
  help(term) {
    term.std.writeColor("Example: [rf] mwomp.txt", "blue");
  },
  description: "Read a file from ArcFS",
  syntax: "<[filename]>",
};
