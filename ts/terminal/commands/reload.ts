import type { Command } from "../interface";

export const Reload: Command = {
  keyword: "reload",
  async exec(cmd, argv, term) {
    await term.reload();

    return false;
  },
  description: "Reload the ArcTerm configuration",
};
