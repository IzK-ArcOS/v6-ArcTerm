import { getJsonHierarchy, setJsonHierarchy } from "$ts/hierarchy";
import { tryParseInt } from "$ts/int";
import { tryJsonConvert } from "$ts/json";
import { ProcessStack } from "$ts/stores/process";
import { Command } from "../interface";

export const PokeCommand: Command = {
  keyword: "poke",
  exec(cmd, argv, term, flags) {
    const { address, pid: pidStr, data } = flags;

    const pid = tryParseInt(pidStr);
    const proc = ProcessStack.getProcess(+pid);

    if (!proc || !proc.app) return term.std.Error(`Unknown or non-app process [${pid}].`);

    const mutator = proc.mutator.get();

    if (data) {
      setJsonHierarchy(mutator, address, tryJsonConvert(data));

      proc.mutator.set(mutator);
    } else {
      term.std.writeLine(JSON.stringify(getJsonHierarchy(mutator, address), null, 2));
    }
  },
  flags: [
    {
      keyword: "address",
      description: "The Appdata address to get or set",
      required: true,
      value: {
        type: "string",
        name: "hierarchy",
      },
    },
    {
      keyword: "pid",
      description: "The process PID to poke",
      required: true,
      value: {
        type: "number",
        name: "id",
      },
    },
    {
      keyword: "data",
      description: "Data to write to the address",
      value: {
        type: "other",
        name: "setter",
      },
    },
  ],
  description: "Get or set the app data of a process",
};
