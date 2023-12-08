import { compileStringLog } from "$ts/console/collector";
import { writeFile } from "$ts/server/fs/file";
import type { Command } from "../interface";

export const LogDump: Command = {
  keyword: "logdump",
  async exec(cmd, argv, term) {
    const filename = `LogDump-${Math.floor(Math.random() * 1e9)}.txt`;

    term.std.writeColor(`Writing log to [${filename}]...\n`, "purple");

    let str = "-- [START OF LOG] --\n";

    str += compileStringLog().join("\n");

    const b = new Blob([str], { type: "text/plain" });

    await writeFile(`${term.path}/${filename}`, b);

    term.vars.set("ldout", filename);

    term.std.writeColor(`\nWrote [${str.length}] bytes.`, "purple");
  },
  description: "Dump the log to a file",
  hidden: true,
};
