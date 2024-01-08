import { formatBytes } from "$ts/bytes";
import { getDeviceInfo } from "$ts/device";
import { ArcOSVersion, minArcAPI } from "$ts/env";
import { ARCOS_BUILD, ARCOS_MODE } from "$ts/metadata";
import { isDesktop } from "$ts/metadata/desktop";
import { getServer } from "$ts/server/multi";
import { PrimaryState } from "$ts/states";
import { UserName } from "$ts/stores/user";
import { Color, colors, Command } from "../interface";
import type { ArcTerm } from "../main";

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
  const desktopStr = desktop ? "Desktop" : "Browser"
  const state = PrimaryState.current.get().name;

  return Object.entries({
    OS: `ArcOS ${ArcOSVersion}-${ARCOS_MODE} (${ARCOS_BUILD})`,
    Host: `${getServer()} @ rev ${minArcAPI}`,
    Username: UserName.get(),
    Mode: `${desktopStr} (state ${state})`,
    Terminal: a.referenceId,
    CPU: `${info.cpu.cores} cores`,
    GPU: `${info.gpu.vendor} ${info.gpu.model}`,
    Memory: `~ ${formatBytes(info.mem.kb)}`,
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
    "           ",
    "     /\\    ",
    "    /  \\   ",
    "   / /\\ \\  ",
    "  / ____ \\ ",
    " /_/    \\_\\",
    "           ",
    "           "
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
