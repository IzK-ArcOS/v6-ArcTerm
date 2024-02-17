import { focusedPid } from "$ts/stores/apps/focus";
import { Command } from "../interface";

export const Pause: Command = {
  keyword: "pause",
  async exec(cmd, argv, term, flags) {
    if (!flags.silent) term.std.writeLine("Press any key to continue . . .");

    await new Promise((r) =>
      document.addEventListener("keydown", () => {
        if (term.app ? focusedPid.get() == term.pid : true) r(null);
      })
    );
  },
  description: "Pause until a key is pressed",
  flags: [
    {
      keyword: "silent",
      description: "Don't display the prompt",
    },
  ],
};
