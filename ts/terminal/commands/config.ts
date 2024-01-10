import type { Command } from "../interface";

export const Config: Command = {
  keyword: "config",
  exec(cmd, argv, term) {
    const e = Object.entries(term.env.config.getConfig());

    for (const [k, v] of e) {
      const str = v.toString().replaceAll("\n", "\\n");
      const key = k.padEnd(20, " ");

      if (k === "gooseBumps") continue;

      term.std.writeColor(`# [${key}]: `, "blue", "white", true);
      term.std.write(`${str}`);
      term.std.writeLine("");
    }
  },
  description: "List configuration options",
};
