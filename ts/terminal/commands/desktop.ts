import { PrimaryState } from "$ts/states";
import { getSwitches } from "../argv";
import type { Command } from "../interface";

export const Desktop: Command = {
  keyword: "desktop",
  exec(cmd, argv, term) {
    if (term.app)
      return term.std.Error("You already are in the ArcOS desktop!");

    if (/* get(previouslyLoaded) &&  */ !getSwitches(argv)["force"])
      return term.std.Error(
        "The desktop may not be initialized twice in one instance. Please use [RESTART]."
      );

    PrimaryState.navigate("desktop");
  },
  description: "Switch to Desktop",
};
