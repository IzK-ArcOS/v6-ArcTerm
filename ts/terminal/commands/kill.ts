import { GetUserElevation } from "$ts/elevation";
import { tryJsonConvert } from "$ts/json";
import { ElevationKillProcess } from "$ts/stores/elevation";
import { ProcessStack } from "$ts/stores/process";
import { ProcessKillResultCaptions } from "$ts/stores/process/captions";
import type { Command } from "../interface";

export const Kill: Command = {
  keyword: "kill",
  async exec(cmd, argv, term) {
    const pid = tryJsonConvert<number>(argv[0]) as number;
    const process = ProcessStack.getProcess(pid);

    if (!pid) return term.std.Error("Missing process ID.");
    if (!process)
      return term.std.Error(
        ProcessStack.isPid(pid)
          ? ProcessKillResultCaptions.err_disposed
          : ProcessKillResultCaptions.err_noExist
      );

    const elevated = await GetUserElevation(ElevationKillProcess(process), ProcessStack);
    const status = await ProcessStack.kill(pid, elevated);

    if (status !== "success") return term.std.Error(ProcessKillResultCaptions[status]);

    if (term && term.std) term.std.Info(`Success: [${pid}] has been terminated.`);
  },
  help(term) {
    term.std.writeColor("Example: [kill] 389176", "blue");
  },
  description: "Terminate a process",
  syntax: `<[pid]>`,
};
