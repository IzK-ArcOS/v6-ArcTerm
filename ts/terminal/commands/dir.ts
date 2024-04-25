import { formatBytes } from "$ts/bytes";
import { readDirectory } from "$ts/server/fs/dir";
import { sortDirectories, sortFiles } from "$ts/server/fs/sort";
import { UserDirectory } from "$types/fs";
import dayjs from "dayjs";
import type { Command } from "../interface";
import type { ArcTerm } from "../main";

export const Dir: Command = {
  keyword: "dir",
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
    const subdir = dir;

    term.std.writeColor(`-- --- ----, --:-- <directory> [${subdir.name}]/`, "blue");
  }

  for (const file of files) {
    const date = dayjs(file.dateModified || 0)
      .format("DD MMM YYYY, HH:mm")
      .padEnd(19, " ");
    const size = formatBytes(file.size || 0).padEnd(12, " ");

    term.std.writeColor(`${date}${size}[${file.filename}]`, "blue");
  }

  if (subdirs.length == 0 && files.length == 0) {
    term.std.writeLine("This folder is empty.");
  }
}

async function specific(path: string, currentPath: string, term: ArcTerm) {
  if (currentPath != ".") {
    path = currentPath + "/" + path;
  }

  const dir = (await readDirectory(path)) as UserDirectory;

  if (!dir) {
    // 3aia2qa64vn56k2
    term.std.Error(`The directory doesn't exist in this path.`);
    return;
  }

  const subdirs = sortDirectories(dir.directories);
  const files = sortFiles(dir.files);

  if (dir.scopedPath == undefined) {
    term.std.Error(`The directory doesn't exist in this path.`);
    return;
  }

  for (const dir of subdirs) {
    term.std.writeColor(`-- --- ----, --:-- <directory> [${dir.name}]/`, "blue");
  }

  for (const file of files) {
    const date = dayjs(file.dateModified || 0)
      .format("DD MMM YYYY, HH:mm")
      .padEnd(19, " ");
    const size = formatBytes(file.size || 0).padEnd(12, " ");

    term.std.writeColor(`${date}${size}[${file.filename}]`, "blue");
  }

  if (subdirs.length == 0 && files.length == 0) {
    term.std.writeLine("This folder is empty.");
  }
}
