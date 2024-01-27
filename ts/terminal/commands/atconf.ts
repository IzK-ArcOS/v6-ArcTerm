import { getPartialFile } from "$ts/server/fs/file";
import { openFileWithApp } from "$ts/server/fs/open";
import { Command } from "../interface";

export const ATConf: Command = {
  keyword: "atconf",
  async exec() {
    const partial = await getPartialFile("./arcterm.conf");

    openFileWithApp("TextEditor", partial)
  },
  description: "Edit your ArcTerm configuration in the Text Editor",
}