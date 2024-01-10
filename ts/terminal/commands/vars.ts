import type { Command } from "../interface";

export const Vars: Command = {
  keyword: "vars",
  async exec(cmd, argv, term) {
    const variables = Object.entries(await term.vars.getAll());

    for (const [id, variable] of variables) {
      if (!variable.value) continue;

      const str = variable.value;
      const key = id.padEnd(20, " ");

      const prefix = variable.readOnly ? "#" : " ";

      term.std.writeColor(`${prefix} [${key}]: `, "aqua", "white", true);
      term.std.write(`${str}`);
      term.std.writeLine("");
    }
  },
  description: "List the variables",
};
