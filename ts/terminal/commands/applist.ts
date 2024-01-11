import { isPopulatable } from "$ts/apps/utils";
import { appLibrary } from "$ts/stores/apps";
import { App } from "$types/app";
import { switchExists } from "../argv";
import type { Command } from "../interface";
import type { ArcTerm } from "../main";

export const AppList: Command = {
  keyword: "applist",
  exec(cmd, argv, term, flags) {
    const all = flags.a || flags.all;
    const store = appLibrary.get();

    header(term);

    for (const [_, app] of store) {
      if (!isPopulatable(app) && !all) continue;

      output(term, app);
    }
  },
  help(term) {
    term.std.writeLine(
      "ArcOS applications are stored in the App Library. The `applist`\ncommand displays this library. Each library item has an ID\nalong with its App data.\n\nBy default, only non-hidden applications are displayed in this table.\nUse the `--all` or `-a` option to override this condition.\n "
    );
    term.std.writeColor("Example: [applist] --all", "blue");
  },
  description: "List all- or opened ArcOS apps.",
  flags: [
    { keyword: "a|all" }
  ]
};

function output(term: ArcTerm, app: App) {
  const aid = app.id.padEnd(30, " ");
  const name = app.metadata.name.padEnd(30, " ");
  const version = app.metadata.version;
  term.std.writeColor(`${name}[${aid}]${version}`, "gray");
}

function header(term: ArcTerm) {
  const hName = `Name`.padEnd(30, " ");
  const hId = `ID`.padEnd(30, " ");
  const hVer = `Version`;

  const head = `${hName}${hId}${hVer}`;

  term.std.writeColor(`[${head}]`, "yellow");
  term.std.writeSeparator(head.length);
}
