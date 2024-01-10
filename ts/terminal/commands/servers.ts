import { getAuthcode } from "$ts/server/authcode";
import { getAllServers } from "$ts/server/multi";
import type { Command } from "../interface";

export const Servers: Command = {
  keyword: "servers",
  exec(cmd, argv, term) {
    const servers = getAllServers();

    term.std.writeLine("\n# | Server");
    term.std.writeSeparator(20);

    for (const server of servers) {
      const ac = getAuthcode(server);

      term.std.writeColor(`${ac ? "[#]" : " "} | ${server}`, "orange");
    }

    term.std.writeLine("\n");
    term.std.Info("Servers marked with a '[#]' indicates a protected server.");
  },
  description: "List saved servers",
};
