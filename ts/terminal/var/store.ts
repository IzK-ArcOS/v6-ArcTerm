import { Log } from "$ts/console";
import { ArcOSVersion } from "$ts/env";
import { readDirectory } from "$ts/server/fs/dir";
import { getServer } from "$ts/server/multi";
import { UserName } from "$ts/stores/user";
import { Color, colors, VariableStore } from "../interface";
import type { ArcTerm } from "../main";

export function getArcTermStore(term: ArcTerm): VariableStore {
  Log(`ArcTerm ${term.referenceId}`, "Creating new ArcTermVariableStore");
  return {
    prompt: {
      get: () => term.env.prompt,
      set: async (v) => {
        term.env.prompt = v;

        await term.env.config.writeConfig();
      },
      canDelete: false,
      readOnly: false,
    },
    server: {
      get: () => getServer(),
      readOnly: true,
      canDelete: false,
    },
    username: {
      get: () => UserName.get(),
      readOnly: true,
      canDelete: false,
    },
    version: {
      get: () => ArcOSVersion,
      readOnly: true,
      canDelete: false,
    },
    pwd: {
      get: () => (term.path || "./").replace("./", ""),
      set: async (v) => {
        const dir = await readDirectory(v);

        if (!dir)
          return term.std.Error(`pwd: Directory doesn't exist, falling back.`);

        term.path = v;
      },
      canDelete: false,
      readOnly: false,
    },
    color: {
      get: () => term.env.promptColor,
      set: async (v) => {
        if (!colors.includes(v))
          return term.std.Error("color is invalid, falling back.");

        term.env.promptColor = v as Color;

        await term.env.config.writeConfig();

        term.util.flushAccent();
      },
      canDelete: false,
      readOnly: false,
    },
    ref: {
      get: () => term.referenceId,

      readOnly: true,
      canDelete: false,
    },
    pid: {
      get: () => `${term.pid}`,
      readOnly: true,
      canDelete: false,
    },
  };
}
