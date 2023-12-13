import { processes } from "$ts/stores/apps";
import { Command } from "../interface";
import { ArcTerm } from "../main";

export const TasksCommand: Command = {
  keyword: "tasks",
  exec(cmd, argv, term) {
    const procs = processes.get();

    header(term)

    for (const [pid, proc] of procs) {
      if (proc == "disposed") continue;

      term.std.writeColor(compile(`[${pid}]`, proc.metadata.name, proc.id), "blue")
    }
  },
  description: "Get a list of running processes"
}

function header(term: ArcTerm) {
  const head = compile("PID", "Name", "App ID")

  term.std.writeLine(head);
  term.std.writeSeparator(head.length + 5);
}

function compile(first: string, second: string, third: string) {
  first = first.padEnd(first.includes("[") ? 17 : 15, " ");
  second = second.padEnd(25, " ");

  return first + second + third;
}