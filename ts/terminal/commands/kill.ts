import { tryJsonConvert } from "$ts/json";
import { ProcessStack } from "$ts/stores/process";
import type { Command } from "../interface";

export const Kill: Command = {
  keyword: "kill",
  async exec(cmd, argv, term) {
    const pid = tryJsonConvert<number>(argv[0]);

    if (!pid) return term.std.Error("Missing process ID.");

    const killed = await ProcessStack.kill(pid);

    if (!killed) return term.std.Error(`Process [${pid}] doesn't exist.`);

    if (term && term.std)
      term.std.Info(`Success: [${pid}] has been terminated.`);
  },
  help(term) {
    term.std.writeColor("Example: [kill] 389176", "blue");
  },
  description: "Terminate a process",
  syntax: `<[pid]>`,
};
