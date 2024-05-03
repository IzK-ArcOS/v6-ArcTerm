import type { ArcTerm } from "./main";

export interface Command {
  keyword: string;
  description: string;
  exec: CommandMethod;
  help?: HelpMethod;
  syntax?: string;
  hidden?: boolean;
  flags?: Flag[];
}

export interface Flag {
  keyword: string;
  required?: boolean;
  value?: {
    name: string;
    type: "string" | "number" | "boolean" | "other";
  };
  description?: string;
}

export type Arguments = Record<string, string>;

export type CommandMethod = (
  cmd: string,
  argv: string[],
  term: ArcTerm,
  flags: Arguments
) => false | Promise<false> | any;
export type HelpMethod = (term: ArcTerm) => any;

export type CommandStore = Command[];

export type Color =
  | "red"
  | "green"
  | "orange"
  | "yellow"
  | "blue"
  | "purple"
  | "aqua"
  | "white"
  | "gray";

export const ColorTranslations = {
  r: "red",
  g: "green",
  o: "orange",
  y: "yellow",
  b: "blue",
  p: "purple",
  a: "aqua",
  w: "white",
  G: "gray",
  "*": "RESET",
};

export const colors = "red,orange,yellow,green,aqua,blue,purple".split(",");

export interface Variable {
  get: () => string;
  set?: (v: string) => Promise<any> | any;
  value?: string;
  readOnly: boolean;
  canDelete: boolean;
}

export type VariableStore = { [key: string]: Variable };

export interface StaticVariable {
  value: string;
  readOnly: boolean;
}

export type StaticVariableStore = { [key: string]: StaticVariable };

export type Sections = { [key: string]: string[] };
