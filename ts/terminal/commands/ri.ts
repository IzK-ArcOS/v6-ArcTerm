import { tryParseInt } from "$ts/int";
import { readDirectory } from "$ts/server/fs/dir";
import { readFile } from "$ts/server/fs/file";
import { UserDirectory } from "$types/fs";
import type { Command } from "../interface";
import type { ArcTerm } from "../main";

const DEFSIZE = 20;

export const Ri: Command = {
  keyword: "ri",
  async exec(cmd, argv, term, flags) {
    const file = flags.file;
    const url = flags.url;
    const size = tryParseInt(flags.size);

    term.std.writeLine("\n");

    if (file) return await displayFile(term, file, size || DEFSIZE);
    if (url) return displayUrl(term, url, size || DEFSIZE);

    term.std.Error("Missing parameters.");
  },
  help(term) {
    term.std.writeColor(`Example: [ri] --url="https://tinyurl.com/arcoslogo"`, "blue");
  },
  description: "Display image from ArcFS or URL",
  flags: [
    {
      keyword: "file",
      value: {
        name: "path",
        type: "string",
      },
      description:
        "The ArcFS path to read the image from. Specify if you want to read from the filesystem.",
    },
    {
      keyword: "url",
      value: {
        name: "url",
        type: "string",
      },
      description:
        "The URL to read the image from. Specify if you want to read from a web resource.",
    },
    {
      keyword: "height",
      value: {
        name: "pixels",
        type: "number",
      },
      description: "The height in pixels of the image to be displayed. Defaults to 20px.",
    },
  ],
};

async function displayFile(term: ArcTerm, fn: string, height: number) {
  const path = term.path as string;
  const dir = (await readDirectory(path)) as UserDirectory;

  for (const partial of dir.files) {
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

function displayUrl(term: ArcTerm, url: string, height: number) {
  term.std.writeImage(url, height || DEFSIZE);
}
