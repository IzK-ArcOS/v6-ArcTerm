import type { Command } from "../interface";
import type { ArcTerm } from "../main";

export const History: Command = {
  keyword: "history",
  exec(cmd, argv, term, flags) {
    if (flags.clear) return clear(term);

    const hist = term.history.store.get();

    for (let i = 0; i < hist.length; i++) {
      const index = `${i}`.padStart(3, "0");

      term.std.writeColor(`[${index}]: ${hist[i]}`, "yellow");
    }
  },
  help(term) {
    term.std.writeColor("Example: [history] --clear", "blue");
  },
  description: "Show the command history",
  flags: [
    {
      keyword: "clear",
      description: "Clear the history buffer",
    },
  ],
};

function clear(term: ArcTerm) {
  const len = term.history.store.get().length;

  term.history.clear();

  term.std.Info(`History cleared, ${len} items removed.`);
}
