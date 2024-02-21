import { tryParseInt } from "$ts/int";
import type { Command } from "../interface";

export const Read: Command = {
  keyword: "read",
  async exec(cmd, argv, term, flags) {
    const key = flags.var;
    const mask = !!flags.mask;
    const prompt = flags.prompt;
    const max = tryParseInt(flags.max);

    if (!max) return term.std.Error("--max needs to be a positive number.");

    const value = await term.std.read(`${prompt} `, "", max || 100, mask);
    const setter = term.vars.set(key, value);

    if (!setter) term.std.Error("Unable to set variable: it is read-only!");
  },
  description: "Read user input to a variable",
  flags: [
    {
      keyword: "var",
      value: {
        name: "variable",
        type: "string",
      },
      description: "The variable to write the user-specified value to",
      required: true,
    },
    {
      keyword: "mask",
      description: "Masks the input value when entering",
    },
    {
      keyword: "prompt",
      value: {
        name: "text",
        type: "string",
      },
      description: "An optional prompt to display to the user",
    },
    {
      keyword: "max",
      value: {
        name: "length",
        type: "number",
      },
      description: "The maximal amount of characters the user can enter",
      required: true,
    },
  ],
};
