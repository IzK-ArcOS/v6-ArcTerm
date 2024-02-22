import { tryParseInt } from "$ts/int";
import { GlobalDispatch } from "$ts/process/dispatch/global";
import { ProcessStack } from "$ts/stores/process";
import { DispatchCaptions } from "$ts/stores/process/dispatch";
import { Command } from "../interface";

export const Dispatch: Command = {
  keyword: "dispatch",
  exec(cmd, argv, term, flags) {
    const command = flags.cmd;
    const data = flags.data;
    const app = flags.app;
    const pid = tryParseInt(flags.pid);
    const list = flags.list;

    if (list) {
      term.std.writeLine("Global dispatches known to ArcOS:");

      for (const key in DispatchCaptions) {
        const keyStr = key.padEnd(25, " ");
        term.std.writeColor(`[${keyStr}] ${DispatchCaptions[key]}`, "blue");
      }

      return;
    }

    if (!command) return term.std.Error("Nothing to dispatch!");

    if (!app && !pid) {
      GlobalDispatch.dispatch(command, data);

      term.std.Info(`Dispatched [${command}] over GlobalDispatch.`);

      return;
    }

    if (app) {
      ProcessStack.dispatch.dispatchToApp(app, command, data);

      term.std.Info(`Dispatched [${command}] to app [${app}] over ProcessDispatcher`);
    } else if (pid) {
      ProcessStack.dispatch.dispatchToPid(pid, command, data);

      term.std.Info(`Dispatched [${command}] to process [${pid}] over ProcessDispatcher`);
    }
  },
  description: "Dispatch a global command",
  flags: [
    {
      keyword: "cmd",
      value: {
        name: "command",
        type: "string",
      },
      description: "The command to dispatch",
    },
    {
      keyword: "data",
      value: {
        name: "string",
        type: "string",
      },
      description: "Data to send in as the first argument",
    },
    {
      keyword: "app",
      value: {
        name: "id",
        type: "string",
      },
      description: "Optional app ID to dispatch to",
    },
    {
      keyword: "pid",
      value: {
        name: "pid",
        type: "number",
      },
      description: "Optional process PID to dispatch to",
    },
    {
      keyword: "list",
      description: "Display a list of available Global Dispatches",
    },
  ],
};
