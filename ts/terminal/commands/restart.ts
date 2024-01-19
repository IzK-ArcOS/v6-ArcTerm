import { restart } from "$state/Desktop/ts/power";
import { PrimaryState } from "$ts/states";
import type { Command } from "../interface";

export const Restart: Command = {
  keyword: "restart",
  exec(cmd, argv, term) {
    const state = PrimaryState.current.get().key;

    if (state == "desktop") return restart();

    term.std.writeColor("[RESTART]: Terminating NOW.", "green");

    setTimeout(() => {
      location.reload();
    }, 1000);
  },

  description: "Restart ArcOS",
};
