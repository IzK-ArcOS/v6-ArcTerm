import { killProcess } from "$ts/apps/process";
import { tryJsonConvert } from "$ts/json";
import type { Command } from "../interface";

export const Kill: Command = {
  keyword: "kill",
  exec(cmd, argv, term) {
    const pid = tryJsonConvert<number>(argv[0]);

    if (!pid) return term.std.Error("Missing process ID.");

    const killed = killProcess(pid);

    if (!killed) return term.std.Error(`Process with PID ${pid} doesn't exist.`)

    if (term && term.std) term.std.writeLine(`Closed ${pid}`);
  },
  help(term) {
    term.std.writeColor("Example: [kill] 389176", "blue");
  },
  description: "Terminate a process",
  syntax: `"<[pid]>"`,
};
