import type { ArcTerm } from "./main";

export function ArcTermIntro(term: ArcTerm) {
  if (!term.env.logo) return;

  const x = [
    "   [_]         _____            ",
    "  [/_\\]  _ _ _|_   _|__ _ _ _ __ ",
    " [/ _ \\]| '_/ _|| |/ -_) '_| '  \\",
    "[/_/ \\_\\]_| \\__||_|\\___|_| |_|_|_|",
  ];

  for (const line of x) {
    term.std.writeColor(line, "blue");
  }

  term.std.writeLine("\n");
}
