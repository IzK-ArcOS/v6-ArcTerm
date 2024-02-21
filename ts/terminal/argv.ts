import { Arguments } from "./interface";

/**
 * Parses the ArcTerm flags from the ArcTerm input
 * @param args The argument string to parse from
 * @returns The parsed flags
 */
export function parseFlags(args: string): Arguments {
  const regex = /(?:--(?<nl>[a-z\-]+)(?:="(?<vl>.*?)"|(?:=(?<vs>.*?)(?: |$))|)|-(?<ns>[a-zA-Z]))/gm; //--name=?value
  const matches: RegExpMatchArray[] = [];

  let match: RegExpExecArray | null;

  while ((match = regex.exec(args))) {
    matches.push(match);
  }

  const result = {};
  const arglist = matches.map((match) => {
    const name = match.groups.nl || match.groups.ns;
    const value = match.groups.vl || match.groups.vs || true; // make it true if the flag has no value at all

    return { name, value };
  });

  for (const arg of arglist) {
    result[arg.name] = arg.value;
  }

  return result;
}
