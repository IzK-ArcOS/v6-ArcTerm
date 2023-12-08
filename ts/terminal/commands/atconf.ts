import { readFile } from "$ts/server/fs/file";
import { ArcFile } from "$types/fs";
import type { Command } from "../interface";

export const ATConf: Command = {
  keyword: "atconf",
  async exec(cmd, argv, term) {
    const data: ArcFile = {
      name: "arcterm.conf",
      path: term.env.config.configPath,
      data: (await readFile(term.env.config.configPath)) as ArrayBuffer,
      mime: "application/json",
    };

    FileLoaders.editFile.loader(data);
  },

  description: "Edit ArcTerm configuration",
};
