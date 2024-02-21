import { formatBytes } from "$ts/bytes";
import { getFSQuota } from "$ts/server/fs/quota";
import { Command } from "../interface";

export const QuotaCommand: Command = {
  keyword: "quota",

  async exec(cmd, argv, term) {
    const BAR_LENGTH = 50;
    const quota = await getFSQuota();
    const perc = (100 / quota.max) * quota.used;
    const filled = perc / 2;
    const filler = "#".repeat(filled).padEnd(BAR_LENGTH, " ");
    const used = formatBytes(quota.used);
    const max = formatBytes(quota.max);
    const sub = `[${used.padEnd(BAR_LENGTH + 2 - max.length, " ") + max}]`;

    term.std.writeLine("\n");
    term.std.writeColor(`([${filler}])`, "blue");
    term.std.writeColor(sub, "gray");
  },
  description: "Display your ArcFS Quota",
};
