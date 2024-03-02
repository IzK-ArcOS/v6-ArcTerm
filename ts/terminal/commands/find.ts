import { tryJsonConvert } from "$ts/json";
import { Search } from "$ts/search";
import { Command } from "../interface";

export const FindCommand: Command = {
  keyword: "find",
  async exec(cmd, argv, term, flags) {
    const query = tryJsonConvert(argv.join(" "));
    const results = (await Search((query as string).toString())).map((r) => r.item);

    if (!results.length)
      return term.std.Warning("ArcTerm didn't find anything! Try changing your search query.");

    results.splice(6);

    const selection = await term.std.select([
      "(Cancel)",
      ...results.map((r) => `${r.caption.padEnd(30, " ")} - ${r.description || "No description"}`),
    ]);

    if (selection == 0) return;

    const result = results[selection - 1];

    await result.action(result);
  },
  description: "Find files, settings and apps in ArcOS",
};
