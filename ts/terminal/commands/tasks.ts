import { Process } from "$ts/process";
import { ProcessStack } from "$ts/stores/process";
import { Longest } from "$ts/util";
import { Command } from "../interface";
import { ArcTerm } from "../main";

export const TasksCommand: Command = {
  keyword: "tasks",
  exec(cmd, argv, term) {
    const procs = ProcessStack.processes.get();
    const longest = Longest(...[...procs].map(([_, p]) => p.name));

    header(term, longest);

    for (const [pid, proc] of procs) {
      if (proc._disposed) continue;

      const process = proc as Process;

      term.std.writeColor(
        compile(`[${pid}]`, process.name, process.app ? process.app.metadata.name : "", longest),
        "blue"
      );
    }
  },
  description: "Get a list of running processes",
};

function header(term: ArcTerm, length: number) {
  const head = compile("PID", "Process", "App Name?", length);

  term.std.writeLine(head);
  term.std.writeSeparator(head.length + 5);
}

function compile(first: string, second: string, third: string, length: number) {
  first = first.padEnd(first.includes("[") ? 17 : 15, " ");
  second = second.padEnd(length + 2, " ");

  return first + second + third;
}
