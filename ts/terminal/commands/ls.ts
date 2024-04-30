import { readDirectory } from "$ts/server/fs/dir";
import { sortDirectories, sortFiles } from "$ts/server/fs/sort";
import { UserDirectory } from "$types/fs";
import type { Command } from "../interface";
import type { ArcTerm } from "../main";

export const Ls: Command = {
  keyword: "ls",
  async exec(cmd, argv, term) {
    const path = term.path as string;
    const dir = (await readDirectory(path)) as UserDirectory;

    if (argv[0]) return specific(argv[0], path, term);
    all(dir, term);
  },
  description: "List the contents of the current directory",
  syntax: `<[path]>`,
};

function all(dir: UserDirectory, term: ArcTerm) {
  const subdirs = sortDirectories(dir.directories);
  const files = sortFiles(dir.files);

  for (const dir of subdirs) {
    term.std.writeColor(`[${dir.name}  ]`, "blue");
  }

  for (const file of files) {
    term.std.writeColor(`[${file.filename}  ]`, "aqua");
  }

  if (subdirs.length == 0 && files.length == 0) {
    term.std.writeLine("This folder is empty.");
  }
}

async function specific(path: string, currentPath: string, term: ArcTerm) {
  if (currentPath != "." && currentPath != "./") {
    path = currentPath + "/" + path;
  }

  const dir = (await readDirectory(path)) as UserDirectory;
  const subdirs = sortDirectories(dir.directories);
  const files = sortFiles(dir.files);

  if (!dir || dir.scopedPath == undefined) {
    term.std.Error(`The directory doesn't exist in this path.`);
    return;
  }

  for (const dir of subdirs) {
    term.std.writeColor(`[${dir.name}]`, "blue");
  }

  for (const file of files) {
    term.std.writeColor(`[${file.filename}]`, "aqua");
  }

  if (subdirs.length == 0 && files.length == 0) {
    term.std.writeLine("This folder is empty.");
  }
}
