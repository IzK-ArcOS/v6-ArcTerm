import { Arguments } from "./interface";

export function getSwitches(argv: string[]) {
  let switches: { [key: string]: string } = {};
  let currentArg = "";

  const prefix = "--";

  for (const arg of argv) {
    if (arg.startsWith(prefix)) {
      const str = arg.replace(prefix, "");

      currentArg = str == currentArg ? currentArg : str;

      if (!switches[currentArg]) switches[currentArg] = "";
    } else if (currentArg) {
      switches[currentArg] += `${arg} `;
    }
  }

  for (const key in switches) {
    switches[key] = switches[key].trim();
  }

  return switches;
}

export function parseFlags(args: string): Arguments {
  const regex = /--(?<name>[a-z]+)(?:=(?<value>.*?)(?: |$)|)/gm; //--name=?value
  const matches: RegExpMatchArray[] = [];

  let match: RegExpExecArray | null;

  while ((match = regex.exec(args))) {
    matches.push(match);
  }

  const result = {};
  const arglist = matches.map((match) => {
    return { name: match.groups.name, value: match.groups.value };
  });

  for (const arg of arglist) {
    result[arg.name] = arg.value;
  }

  return result;
}

export function switchExists(argv: string[], key: string): boolean {
  const switches = getSwitches(argv);

  for (const sw in switches) {
    if (sw == key) return true;
  }

  return false;
}
