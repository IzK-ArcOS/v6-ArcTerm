import { UserName } from "$ts/stores/user";
import type { Command } from "../interface";

export const Logout: Command = {
  keyword: "logout",
  exec(cmd, argv, term) {
    if (term.app) throw new Error("Not Implemented: restarting from desktop"); // FIXME

    localStorage.removeItem("arcos-remembered-token");
    UserName.set(undefined);

    term.dispose();
    setTimeout(() => {
      term.initialize();
    });
  },
  description: "Logout ArcOS",
};
