import { PrimaryState } from "$ts/states";
import type { Command } from "../interface";

export const StateCommand: Command = {
  keyword: "state",
  exec(cmd, argv, term) {
    const state = argv.join(" ");

    if (!state) {
      const s = PrimaryState.current.get();

      return term.std.writeColor(
        `Current state: [${s.name}] (ArcOS.state.[${s.key}])`,
        "purple"
      );
    }

    PrimaryState.navigate(state);
  },
  syntax: "<[stateId]>",
  description: "for debugging -- forcefully change the state",
  hidden: true,
};
