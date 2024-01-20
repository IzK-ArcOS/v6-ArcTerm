import { spawnApp } from "$ts/apps";
import { Command } from "../interface";

export const ExploreCommand: Command = {
  keyword: "explore",
  description: "Open current directory in the File Manager",
  exec(cmd, argv, term) {
    spawnApp("FileManager", 0, [term.path]);
  }
}