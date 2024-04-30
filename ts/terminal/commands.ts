import { Log } from "$ts/console";
import { parseFlags } from "./argv";
import { Default } from "./commands/default";
import type { Arguments, Command } from "./interface";
import type { ArcTerm } from "./main";
export class ArcTermCommandHandler {
  term: ArcTerm;

  constructor(term: ArcTerm) {
    Log(`ArcTerm ${term.referenceId}`, `Creating new ArcTermCommandHandler`);

    this.term = term;
  }

  public async evaluate(cmd: string, args?: string[], isScript = false, provider?: Command[]) {
    Log(`ArcTerm ${this.term.referenceId}`, `cmd.evaluate: ${cmd}`);

    const argStr = args.join(" ");

    if (cmd.startsWith("#")) return;

    const command = this.getCommand(cmd, provider);

    if (isScript && command.keyword == "default") return false;

    if (this.term.input && this.term.input.current) this.term.input.current.disabled = true;

    if (!this.requiredFlagsSpecified(command, argStr)) {
      this.term.std.Error(`${cmd}: missing required parameters. Type [help ${cmd}] for usage.`);

      // sdc8m4a41xbnw5q, t9up7ifl5pa7zvz
      if (this.term.std && this.term.std.verbose && !isScript) this.term.std.writeLine("\n");

      this.term.input.unlock();

      return false;
    }

    const result = await command.exec(cmd, args, this.term, parseFlags(argStr));

    if (!this.term.std) return false;

    if (this.term.std.verbose && !isScript) this.term.std.writeLine("\n");
    if (!isScript) this.term.input.unlock();
    if (result == false) return false;
    if (!this.term.std || !this.term.input) return true;

    return command.keyword != "default";
  }

  public getCommand(command: string, provider?: Command[]) {
    const commandLower = command.toLowerCase();

    const commands = provider ? provider : this.term.commands;

    for (const command of commands) {
      const lower = command.keyword.toLowerCase();

      if (lower == commandLower) return command;
    }

    return Default;
  }

  public compileFlagStr(command: Command): string {
    const flags = command.flags || [];

    let result = `${command.keyword} `;

    if (!flags.length) return `${result}${command.syntax || ""}`;

    for (const flag of flags) {
      const prefix = "--";
      const name = `[${flag.keyword}]${flag.required ? "" : "?"}`;
      const needsValue = !!flag.value;
      const q = needsValue && flag.value.type == "string" ? '"' : "";
      const suffix = needsValue ? `=${q}[${flag.value.name}]${q}` : "";

      result += `${prefix}${name}${suffix} `;
    }

    return `${result}${command.syntax || ""}`;
  }

  public compileHelpSwitches(command: Command): string {
    const flags = command.flags || [];

    let result = `\n`;

    if (!flags.length) return "";

    for (const flag of flags) {
      const prefix = "--";
      const name = `[${flag.keyword}]${flag.required ? "" : "?"}`.padEnd(20, " ");
      const description = `${flag.description} ${flag.required ? "" : "(Optional)"}`;

      result += `${prefix}${name}${description}\n`;
    }

    return result;
  }

  public requiredFlagsSpecified(command: Command, args: string) {
    if (!command.flags) return true;

    const flags: Arguments = parseFlags(args);

    for (const flag of command.flags) {
      const value = flags[flag.keyword];
      const required = flag.required;
      const valueObject = flag.value;

      if (required && (!value || typeof value != (valueObject ? "string" : "boolean")))
        return false;
    }

    return true;
  }
}
