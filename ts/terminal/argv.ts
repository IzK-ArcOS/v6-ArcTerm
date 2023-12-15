import { Arguments } from "./interface";

export function getSwitches(argv: string[]) {
  let switches: { [key: string]: string } = {};
  let currentArg = "";

  const prefix = "--";

  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith(prefix)) {
      const arg = argv[i].replace(prefix, "");

      currentArg = arg == currentArg ? currentArg : arg;

      if (!switches[currentArg]) switches[currentArg] = "";
    } else if (currentArg) {
      switches[currentArg] += `${argv[i]} `;
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
  const arglist = matches.map((match) => { return { name: match.groups.name, value: match.groups.value } })

  for (let i = 0; i < arglist.length; i++) {
    result[arglist[i].name] = arglist[i].value;
  }

  return result
}

export function switchExists(argv: string[], key: string): boolean {
  const switches = getSwitches(argv);

  for (const sw in switches) {
    if (sw == key) return true;
  }

  return false;
}
