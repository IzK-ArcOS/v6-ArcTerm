import type { Color, Command } from "../interface";

export const Colors: Command = {
  keyword: "colors",
  exec(cmd, argv, term) {
    const str = argv.join(" ").trim() || "The quick brown fox jumps over the lazy dog.";

    const colors: Color[] = [
      "gray",
      "white",
      "red",
      "orange",
      "yellow",
      "green",
      "aqua",
      "blue",
      "purple",
    ];

    for (const color of colors) {
      term.std.writeColor(`${color.padEnd(10, " ")}: [${str}]`, color);
    }
  },
  description: "Print out all ArcTerm colors",
  syntax: "([sample?])",
  hidden: true,
};
