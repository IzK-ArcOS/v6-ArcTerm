import { getJsonHierarchy } from "$ts/hierarchy";
import { UserDataStore } from "$ts/stores/user";
import type { Command } from "../interface";

export const GUD: Command = {
  keyword: "gud",
  exec(cmd, argv, term) {
    const hierarchy = argv[0];
    const udata = UserDataStore.get();
    const currentValue = hierarchy ? getJsonHierarchy(udata, hierarchy) : udata;

    if (!currentValue && typeof currentValue === "undefined" && hierarchy)
      return term.std.Error(`Can't find [UserData.${hierarchy}]!`);

    term.std.writeLine(JSON.stringify(currentValue, null, 2));
  },
  description: "Get a UserData parameter",
  help: (term) => {
    term.std.writeColor(`Example: [sud] sh.desktop.theme`, "blue");
  }
};
