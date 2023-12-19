import { ProcessStack } from "$ts/stores/process";
import type { Command } from "../interface";

export const Exit: Command = {
  keyword: "exit",
  exec(cmd, argv, term) {
    if (!term.pid)
      return term.std.Error(
        "can't close ArcTerm: no associated PID in constructor"
      );

    ProcessStack.kill(term.pid);
  },
  description: "Quit ArcTerm",
};
