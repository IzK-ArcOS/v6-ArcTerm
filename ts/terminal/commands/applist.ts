import { appLibrary } from "$ts/stores/apps";
import { App } from "$types/app";
import type { Command } from "../interface";
import type { ArcTerm } from "../main";

export const AppList: Command = {
  keyword: "applist",
  exec(cmd, argv, term) {
    const store = Object.values(appLibrary.get());

    header(term);

    for (let i = 0; i < store.length; i++) {
      output(term, store[i]);
    }
  },
  help(term) {
    term.std.writeColor("Example: [applist] --open", "blue");
  },
  description: "List all- or opened ArcOS apps.",
  syntax: "([opened?])",
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
