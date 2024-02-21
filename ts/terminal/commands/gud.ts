import { getJsonHierarchy } from "$ts/hierarchy";
import { UserDataStore } from "$ts/stores/user";
import type { Command } from "../interface";

export const GUD: Command = {
  keyword: "gud",
  exec(cmd, argv, term, flags) {
    const hierarchy = argv[0];
    const udata = UserDataStore.get();
    const currentValue = hierarchy ? getJsonHierarchy(udata, hierarchy) : udata;

    // `-` means it's a flag
    if (hierarchy && hierarchy.startsWith("-"))
      return term.std.Error("Hierarchy has to be the first argument!");

    if (!currentValue && typeof currentValue === "undefined" && hierarchy)
      return term.std.Error(`Can't find [UserData.${hierarchy}]!`);

    if (flags.var && typeof flags.var === "boolean")
      return term.std.Error("Need a variable to write to!");

    term.vars.set(flags.var, currentValue);

    term.std.writeLine(JSON.stringify(currentValue, null, 2));
  },
  description: "Get a UserData parameter",
  help: (term) => {
    term.std.writeColor(`Example: [sud] sh.desktop.theme`, "blue");
  },
  flags: [
    {
      keyword: "var",
      value: {
        name: "variable",
        type: "other",
      },
      description: "Variable to write the result to",
    },
  ],
};
