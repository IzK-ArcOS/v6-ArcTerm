import { createReport } from "$ts/bugrep";
import { LogStore } from "$ts/console";
import { writeFile } from "$ts/server/fs/file";
import { switchExists } from "../argv";
import type { Command } from "../interface";

export const RepInfo: Command = {
  keyword: "repinfo",
  async exec(cmd, argv, term) {
    const data = {
      ...createReport({
        body: "This is what a report sent to the Reports server may look like",
        title: "Example report",
        includeApi: true,
        includeUserData: true,
      }),
    } as any;

    if (switchExists(argv, "json")) {
      const json = JSON.stringify(data, null, 2);
      term.std.writeLine(json);

      if (switchExists(argv, "file")) {
        const filename = `${term.path}/repinfo_${new Date().getTime()}.json`;
        const blob = new Blob([json], { type: "application/json" });
        await writeFile(filename, blob);
        term.std.Info(`Written RepInfo to [${filename}]`);
      }

      return;
    }

    data.userdata = "UserData {...}";
    data.log = `LogStore {${LogStore.get().length}}`;

    const entries = Object.entries(data);

    for (const [key, value] of entries) {
      const keyStr = key.padEnd(23, " ");

      if (value && typeof value === "object") {
        term.std.writeColor(`[${keyStr}]:`, "yellow");

        const subEntries = Object.entries(JSON.parse(JSON.stringify(value)));

        for (const [subKey, subValue] of subEntries) {
          const key = subKey.padEnd(18, " ");

          term.std.writeColor(` --> [${key}]: ${subValue}`, "yellow");
        }

        continue;
      }

      term.std.writeColor(`[${key}]: ${value}`, "yellow");
    }
  },
  description: "Display information in a bug report",
  hidden: true,
};
