import { ProcessStack } from "$ts/stores/process";
import { Command } from "../interface";
import { ArcTerm } from "../main";

export const TasksCommand: Command = {
  keyword: "tasks",
  exec(cmd, argv, term) {
    const procs = ProcessStack.processes.get();

    header(term)

    for (const [pid, proc] of procs) {
      if (proc == "disposed") continue;

      term.std.writeColor(compile(`[${pid}]`, proc.name, proc.app ? proc.app.metadata.name : ""), "blue")
    }
  },
  description: "Get a list of running processes"
}

function header(term: ArcTerm) {
  const head = compile("PID", "Process", "App Name?")

  term.std.writeLine(head);
  term.std.writeSeparator(head.length + 5);
}

function compile(first: string, second: string, third: string) {
  first = first.padEnd(first.includes("[") ? 17 : 15, " ");
  second = second.padEnd(25, " ");

  return first + second + third;
}