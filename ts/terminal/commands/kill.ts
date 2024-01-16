import { GetUserElevation } from "$ts/elevation";
import { tryJsonConvert } from "$ts/json";
import { ElevationKillProcess } from "$ts/stores/elevation";
import { ProcessStack } from "$ts/stores/process";
import type { Command } from "../interface";

export const Kill: Command = {
  keyword: "kill",
  async exec(cmd, argv, term) {
    const pid = tryJsonConvert<number>(argv[0]);

    if (!pid) return term.std.Error("Missing process ID.");

    const process = ProcessStack.getProcess(pid)

    if (!process) return term.std.Error(`Process [${pid}] doesn't exist.`)

    const elevated = await GetUserElevation(ElevationKillProcess(process), ProcessStack);

    if (!elevated) return term.std.Error(`Process [${pid}] couldn't be killed: no permission.`)

    const killed = await ProcessStack.kill(pid, true);

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
