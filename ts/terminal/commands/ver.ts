import { ArcOSVersion } from "$ts/env";
import type { Command } from "../interface";

export const Ver: Command = {
  keyword: "ver",
  exec(cmd, argv, term) {
    term.std.writeColor(`ArcOS & ArcTerm [v${ArcOSVersion}]`, "blue");
  },
  description: "Display the version number",
};
