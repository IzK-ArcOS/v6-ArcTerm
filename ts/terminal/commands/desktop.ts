import { PrimaryState } from "$ts/states";
import type { Command } from "../interface";

export const Desktop: Command = {
  keyword: "desktop",
  exec(cmd, argv, term, flags) {
    if (term.app) return term.std.Error("You already are in the ArcOS desktop!");

    const force = flags.force || flags.f;

    if (/* get(previouslyLoaded) &&  */ !force)
      return term.std.Error(
        "The desktop may not be initialized twice in one instance. Please use [RESTART]."
      );

    PrimaryState.navigate("desktop");
  },
  description: "Switch to Desktop",
};
