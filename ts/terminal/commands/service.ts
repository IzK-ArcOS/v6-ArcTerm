import { getService, restartService, startService, stopService } from "$ts/service/interact";
import { ProcessStack } from "$ts/stores/process";
import { ServiceChangeResultCaptions } from "$ts/stores/service/captions";
import dayjs from "dayjs";
import type { Command } from "../interface";
import type { ArcTerm } from "../main";

export const ServiceCommand: Command = {
  keyword: "service",
  description: "Manage services from ArcTerm",
  async exec(_, argv, term) {
    switch (argv[0]) {
      case "start":
        await start(argv, term);
        break;
      case "stop":
        await stop(argv, term);
        break;
      case "restart":
        await restart(argv, term);
        break;
      case "status":
        await status(argv, term);
        break;
      default:
        term.std.Error("Missing or invalid subcommand.");
    }
  },
  help(term) {
    term.std.writeColor("[play] - Plays the specified sound.", "aqua");
    term.std.writeColor("[stop] - Stops the current playing sound.", "aqua");
    term.std.writeColor("[list] - Lists playable sounds.\n\n", "aqua");
    term.std.writeColor("Example: [soundbus] play ...", "blue");
  },
  syntax: "SOUNDBUS <[subcommand]> <...[arguments]>",
};

async function stop(argv: string[], term: ArcTerm) {
  const service = argv[1];
  const status = await stopService(service);

  if (status != "success")
    term.std.Error(
      `Couldn't stop service [${service}]: ${ServiceChangeResultCaptions[status]}`
    );
  else term.std.writeColor(`Stopped service [${service}].`, "blue");
}


async function start(argv: string[], term: ArcTerm) {
  const service = argv[1];
  const result = await startService(service);

  const resultCaption = ServiceChangeResultCaptions[result];

  if (result != "success") {
    term.std.Error(`Couldn't start service [${service}]: ${resultCaption}`);

    term.std.writeLine("\n");
    term.std.writeColor(`[Code: ${result}]`, "gray")

    return;
  }

  term.std.writeColor(`Started service [${service}].`, "blue");
}

async function restart(argv: string[], term: ArcTerm) {
  const service = argv[1];
  const status = await restartService(service);

  if (status !== "success")
    term.std.Error(
      `Couldn't restart service [${service}]: ${ServiceChangeResultCaptions[status]}`
    );
  else term.std.writeColor(`Restarted service [${service}].`, "blue");
}

function status(argv: string[], term: ArcTerm) {
  term.std.writeLine("\n");

  const service = argv[1];
  const data = getService(service);

  if (!data) return term.std.Error(`No such service [${service}]!`);

  const pid = data.pid || 0;
  const statusText = pid ? "✔ Running" : "✖ Stopped";
  const pidString = pid ? `on PID ${pid} - handler ${ProcessStack.id}` : `- no PID`
  const state = pid ? "started" : "stopped"
  const loadedAt = dayjs(data.loadedAt).format("MMM D, HH:mm:ss");
  const changedAt = dayjs(data.changedAt).format("MMM D, HH:mm:ss");

  term.std.writeColor(`[${data.name}] - ${data.description}`, "blue");
  term.std.writeLine("\n");
  term.std.writeColor(`Status:          [${statusText}] ${pidString}`, pid ? "green" : "red")
  term.std.writeColor(`State:           [${state}] - Changed at ${changedAt}`, "purple");
  term.std.writeColor(`Identifier:      [${data.id || service}] ${!data.id ? "(derived)" : ""}`, "purple");
  term.std.writeColor(`Loaded At:       [${loadedAt}]`, "purple");
}