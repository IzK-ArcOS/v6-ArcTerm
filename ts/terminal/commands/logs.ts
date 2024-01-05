import { spawnApp } from "$ts/apps";
import { Command } from "../interface";

export const LogsCommand: Command = {
  keyword: "logs",
  description: "Open LoggerApp at the provided log source",
  exec(cmd, argv, term, flags) {
    const source = argv.join(" ");

    spawnApp("LoggerApp", term.pid, ["all", source]);

    term.std.Info(`Opened [LoggerApp] at source [${source}]`);
  }
}