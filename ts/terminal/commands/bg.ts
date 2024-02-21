import { Wallpapers } from "$ts/stores/wallpaper";
import type { Command } from "../interface";

export const BgCommand: Command = {
  keyword: "bgs",
  exec(cmd, argv, term) {
    const backgrounds = Wallpapers;

    const keys = Object.keys(backgrounds).sort((a, b) => (a < b ? -1 : 1));

    for (const key of keys) {
      const value = backgrounds[key];
      const keyStr = key.padStart(6, " ");
      const nameStr = value.name.padEnd(30, " ");

      term.std.writeColor(`${keyStr}: [${nameStr}] by ${value.author}`, "purple");
    }
  },
  description: "List ArcOS Backgrounds",
};
