import { readDirectory } from "$ts/server/fs/dir";
import { readFile } from "$ts/server/fs/file";
import { UserDirectory } from "$types/fs";
import { getSwitches } from "../argv";
import type { Command } from "../interface";
import type { ArcTerm } from "../main";

const DEFSIZE = 20;

export const Ri: Command = {
  keyword: "ri",
  async exec(cmd, argv, term) {
    const args = getSwitches(argv);

    const file = args["file"];
    const url = args["url"];
    let size: number;

    try {
      size = parseInt(args["height"]);
    } catch {
      size = DEFSIZE;
    }

    term.std.writeLine("\n");

    if (file) return await displayFile(term, file, size || DEFSIZE);

    if (url) return displayUrl(term, url, size || DEFSIZE);

    term.std.Error("Missing parameters.");
  },
  help(term) {
    term.std.writeColor(
      "Example: [ri] --url https://tinyurl.com/arcoslogo",
      "blue"
    );
  },
  description: "Display image from ArcFS or URL",
  flags: [
    { keyword: "file", value: { name: "path", type: "string" }, },
    { keyword: "url", value: { name: "url", type: "string" } },
    { keyword: "height", value: { name: "pixels", type: "number" } },
  ]
};

async function displayFile(term: ArcTerm, fn: string, height: number) {
  const path = term.path as string;

  const dir = (await readDirectory(path)) as UserDirectory;

  for (let i = 0; i < dir.files.length; i++) {
    const partial = dir.files[i];

    if (partial.filename == fn) {
      const file = await readFile(partial.scopedPath);

      if (!file) return term.std.Error("Could not read the file.");

      const blob = file.data;

      const url = URL.createObjectURL(blob);

      term.std.writeImage(url, height);

      return;
    }
  }
}

export function displayUrl(term: ArcTerm, url: string, height: number) {
  term.std.writeImage(url, height || DEFSIZE);
}
