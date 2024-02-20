import { logout } from "$state/Desktop/ts/power";
import { PrimaryState } from "$ts/states";
import { UserName } from "$ts/stores/user";
import type { Command } from "../interface";

export const Logout: Command = {
  keyword: "logout",
  exec(cmd, argv, term) {
    const currentState = PrimaryState.current.get().key;

    if (term.app && currentState == "desktop") return logout();

    localStorage.removeItem("arcos-remembered-token");
    UserName.set(undefined);

    term.dispose();
    setTimeout(() => {
      term.initialize();
    });
  },
  description: "Logout ArcOS",
};
