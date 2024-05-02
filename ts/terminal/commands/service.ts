import {
  getAllServices,
  getService,
  restartService,
  startService,
  stopService,
} from "$ts/service/interact";
import { ElevationChangeServiceState } from "$ts/stores/elevation";
import { ProcessStack } from "$ts/stores/process";
import { ServiceChangeResultCaptions } from "$ts/stores/service/captions";
import { Longest } from "$ts/util";
import dayjs from "dayjs";
import { ArcTermElevate } from "../elevation";
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
      case "list":
        await list(term);
        break;
      default:
        term.std.Error("Missing or invalid subcommand.");
    }
  },
  help(term) {
    term.std.writeLine("\n");
    term.std.writeColor("[start]   - Starts a service.", "aqua");
    term.std.writeColor("[stop]    - Stops a service.", "aqua");
    term.std.writeColor("[restart] - Restarts a service.", "aqua");
    term.std.writeColor("[status]  - Displays status information of a service.", "aqua");
    term.std.writeColor(
      "[list]    - Lists all ArcOS services along with their status.\n\n",
      "aqua"
    );
    term.std.writeColor("Example: [SERVICE] status NotificationService", "blue");
  },
  syntax: "<[start]|[stop]|[restart]|[status]|[list]> <...[arguments]>",
};

async function stop(argv: string[], term: ArcTerm) {
  const service = argv[1];
  const elevated = await ArcTermElevate(ElevationChangeServiceState(getService(service)), term);

  if (!elevated) return;

  const status = await stopService(service, true);

  if (status != "success")
    term.std.Error(`Couldn't stop service [${service}]: ${ServiceChangeResultCaptions[status]}`);
  else term.std.writeColor(`Stopped service [${service}].`, "blue");
}

async function start(argv: string[], term: ArcTerm) {
  const service = argv[1];
  const elevated = await ArcTermElevate(ElevationChangeServiceState(getService(service)), term);

  if (!elevated) return;

  const result = await startService(service, true);

  const resultCaption = ServiceChangeResultCaptions[result];

  if (result != "success") {
    term.std.Error(`Couldn't start service [${service}]: ${resultCaption}`);

    term.std.writeLine("\n");
    term.std.writeColor(`[Code: ${result}]`, "gray");

    return;
  }

  term.std.writeColor(`Started service [${service}].`, "blue");
}

async function restart(argv: string[], term: ArcTerm) {
  const service = argv[1];
  const elevated = await ArcTermElevate(ElevationChangeServiceState(getService(service)), term);

  if (!elevated) return;

  const status = await restartService(service, true);

  if (status !== "success")
    term.std.Error(`Couldn't restart service [${service}]: ${ServiceChangeResultCaptions[status]}`);
  else term.std.writeColor(`Restarted service [${service}].`, "blue");
}

function status(argv: string[], term: ArcTerm) {
  term.std.writeLine("\n");

  const service = argv[1];
  const data = getService(service);

  if (!data) return term.std.Error(`No such service [${service}]!`);

  const pid = data.pid || 0;
  const statusText = pid ? "✔ Running" : "✖ Stopped";
  const pidString = pid ? `on PID ${pid} - handler ${ProcessStack.id}` : `- no PID`;
  const state = pid ? "started" : "stopped";
  const loadedAt = dayjs(data.loadedAt).format("MMM D, HH:mm:ss");
  const changedAt = dayjs(data.changedAt).format("MMM D, HH:mm:ss");

  term.std.writeColor(`[${data.name}] - ${data.description}`, "blue");
  term.std.writeLine("\n");
  term.std.writeColor(`Status:          [${statusText}] ${pidString}`, pid ? "green" : "red");
  term.std.writeColor(`State:           [${state}] - Changed at ${changedAt}`, "purple");
  term.std.writeColor(
    `Identifier:      [${data.id || service}] ${!data.id ? "(derived)" : ""}`,
    "purple"
  );
  term.std.writeColor(`Loaded At:       [${loadedAt}]`, "purple");
}

function list(term: ArcTerm) {
  const services = [...getAllServices()];
  const serviceNames = services.map(([k]) => k);
  const padding = Longest(...serviceNames) + 10;

  for (const [id, service] of services) {
    const name = id.padEnd(padding);
    const pid = service.pid || 0;
    const statusText = pid ? "✔ Running" : "✖ Stopped";

    term.std.writeColor(`${name}[${statusText}] - ${pid || "No PID"}`, pid ? "green" : "red");
  }
}
