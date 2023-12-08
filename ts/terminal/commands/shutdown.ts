import { PrimaryState } from "$ts/states";
import type { Command } from "../interface";

export const Shutdown: Command = {
  keyword: "shutdown",
  exec(cmd, argv, term) {
    if (PrimaryState.current.get().key == "desktop") return shutdown();

    term.std.writeColor("[SHUTDOWN]: Terminating NOW.", "green");

    setTimeout(() => {
      applyState("turnedoff");
    }, 1000);
  },

  description: "Turn off ArcOS",
};
