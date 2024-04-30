import type { Command } from "../interface";
import type { ArcTerm } from "../main";
import { Default } from "./default";

export const Help: Command = {
  keyword: "help",
  exec(cmd, argv, term, flags) {
    if (flags.count)
      return term.std.writeColor(`ArcTerm has [${term.commands.length}] commands.`, "aqua");

    if (argv[0] && !argv[0].startsWith("--")) return specific(argv[0], term);

    all(term, !flags.list);
  },
  help(term) {
    term.std.writeColor("Example: [help] help", "blue");
  },
  description: "Display a list of built-in commands",
  syntax: "([command?])",
  flags: [
    {
      keyword: "count",
      description: "Show the amount of ArcTerm commands.",
    },
    {
      keyword: "list",
      description:
        "Show a list of ArcTerm commands with their descriptions. This flag doesn't work with --count.",
    },
  ],
};

function all(term: ArcTerm, short: boolean) {
  const cmd = term.commands.sort((a, b) => {
    return b.keyword < a.keyword ? 1 : -1;
  });
  if (short) return term.std.writeColor(`[${cmd.map((c) => c.keyword).join("  ")}]`, "aqua");

  for (const command of cmd) {
    const a = command.keyword.toUpperCase().padEnd(15, " ");
    const b = command.description;

    term.std.writeColor(`[${a}]${b}`, command.hidden ? "purple" : "orange");
  }
}

function specific(command: string, term: ArcTerm) {
  const c = term.commandHandler.getCommand(command);

  if (!c || c.keyword == Default.keyword) return term.std.Error(`${command}: command not found.`);

  if (!c.help) {
    term.std.writeColor(`[${c.keyword.toUpperCase()}]: ${c.description}`, "blue");

    term.std.writeLine("\n");
  }

  const flagStr = term.commandHandler.compileFlagStr(c);
  const helpSwitches = term.commandHandler.compileHelpSwitches(c);

  term.std.writeColor(`Usage: ${flagStr}${helpSwitches ? "\n" + helpSwitches : ""}`, "blue");
  term.std.writeLine(helpSwitches ? "\n" : "");

  if (c.help) return c.help(term);
}
