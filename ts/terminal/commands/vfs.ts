import { Command } from "../interface";

export const VfsCommand: Command = {
  keyword: "vfs",
  async exec(cmd, argv, term, flags) {},
  description: "Display virtual filesystem information",
};
