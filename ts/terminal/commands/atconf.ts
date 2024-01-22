import { spawnApp } from "$ts/apps";
import { Command } from "../interface";

export const ATConfCommand: Command = {
  keyword: "atconf",
  exec() {
    spawnApp("TextEditor", 0, ["./arcterm.conf"])
  },
  description: "Edit your ArcTerm configuration in the Text Editor",
}