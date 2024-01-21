import { fromBase64, toBase64 } from "$ts/base64";
import { Command } from "../interface";

export const Base64Command: Command = {
  keyword: "b64",
  async exec(cmd, argv, term, flags) {
    const { var: variable, input, encode, decode, silent } = flags;

    if (encode && decode) return term.std.Error("Can't both encode and decode, goof...");

    if (silent && !variable) return term.std.Error("--silent and no --variable? That's the same as hitting Enter on an empty prompt...");

    let output: string;

    if (encode) output = toBase64(input);
    if (decode) output = fromBase64(input);

    if (!encode && !decode) return term.std.Error("Don't know what to do... --encode or --decode?")

    if (variable) {
      const set = await term.vars.set(variable, output);

      if (!set) return term.std.Error(`Failed to set variable [${variable}]: it might be read-only.`)
    }

    if (!silent) term.std.writeLine(`${input} -> ${output}`);
  },
  description: "Encodes or decodes a Base64 string",
  flags: [
    {
      keyword: "var",
      value: {
        name: "variable",
        type: "other"
      },
      description: "Variable to write the data to"
    }, {
      keyword: "input",
      required: true,
      value: {
        name: "string",
        type: "string"
      },
      description: "The data to encode or decode"
    }, {
      keyword: "encode",
      description: "Specify to encode the input",
    }, {
      keyword: "decode",
      description: "Specify to decode the input"
    }, {
      keyword: "silent",
      description: "Hide the output (requires --var to be set)"
    }
  ]
}