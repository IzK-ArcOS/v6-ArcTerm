import { shutdown } from "$state/Desktop/ts/power";
import { PrimaryState } from "$ts/states";
import { sleep } from "$ts/util";
import type { Command } from "../interface";

export const Shutdown: Command = {
  keyword: "shutdown",
  async exec(cmd, argv, term) {
    const state = PrimaryState.current.get().key;

    if (state == "desktop") return shutdown();

    term.std.writeColor("[SHUTDOWN]: Terminating NOW.", "green");

    await sleep(1000);

    PrimaryState.navigate("turnedoff");
  },

  description: "Log off and shut down ArcOS",
};
