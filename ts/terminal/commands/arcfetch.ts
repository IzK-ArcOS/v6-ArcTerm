import { get } from "svelte/store";
import { Color, colors, Command } from "../interface";
import type { ArcTerm } from "../main";
import { getDeviceInfo } from "$ts/device";
import { isDesktop } from "$ts/metadata/desktop";
import { getServer } from "$ts/server/multi";
import { formatBytes } from "$ts/bytes";
import { UserName } from "$ts/stores/user";
import { minArcAPI } from "$ts/env";
import { PrimaryState } from "$ts/states";

export const ArcFetch: Command = {
  keyword: "arcfetch",
  async exec(cmd, argv, term) {
    term.std.writeLine("\n");

    await graphic(term);

    term.std.writeLine("");

    colorBar(term);
  },
  description: "Show system information",
};

async function getItems(a: ArcTerm) {
  const info = getDeviceInfo();

  const desktop = isDesktop();

  return Object.entries({
    Server: `${getServer()} @ rev ${minArcAPI}`,
    Username: UserName.get(),
    Processor: `${info.cpu.cores} cores`,
    GPU: `${info.gpu.vendor} ${info.gpu.model}`,
    Memory: `~ ${formatBytes(info.mem.kb)}`,
    Mode:
      (desktop ? `Desktop` : `Browser`) +
      ` (state ${PrimaryState.current.get().key})`,
    Reference: a.referenceId,
  });
}

function colorBar(term: ArcTerm) {
  term.std.write("\n                            ");

  for (let i = 0; i < colors.length; i++) {
    term.std.writeColor("[██ ]", colors[i] as Color, "white", true);
  }
}

async function graphic(term: ArcTerm) {
  const items = await getItems(term);

  const graphicParts = [
    "        ",
    "    _   ",
    "   /_\\  ",
    "  / _ \\ ",
    " /_/ \\_\\",
    "        ",
    "        ",
  ];

  for (let i = 0; i < graphicParts.length; i++) {
    term.std.writeColor(`  [${graphicParts[i]}]    `, "blue", "white", true);

    if (items[i]) {
      term.std.writeColor(
        `[${items[i][0].padEnd(12, " ")}]: ${items[i][1]}`,
        "purple",
        "white",
        true
      );
    }

    term.std.writeLine("");
  }
}
