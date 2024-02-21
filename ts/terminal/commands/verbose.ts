import type { Command } from "../interface";

export const Verbose: Command = {
  keyword: "verbose",
  exec(cmd, argv, term, flags) {
    const off = flags.off;
    const on = flags.on;

    if (off && on) return term.std.Error("Can't accept both --on and --off.");

    if (!off && !on) return term.std.Error("Missing --on or --off.");

    if (on) term.std.verbose = true;
    if (off) term.std.verbose = false;
  },
  description: "Set verbose mode on or off.",
  flags: [
    { keyword: "on", description: "Specify to turn on verbosity." },
    { keyword: "off", description: "Specify to turn off verbosity." },
  ],
};
