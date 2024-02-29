import { Log } from "$ts/console";
import { tryJsonConvert } from "$ts/json";
import { blobToText } from "$ts/server/fs/convert";
import { readFile, writeFile } from "$ts/server/fs/file";
import { UserDataStore, UserToken } from "$ts/stores/user";
import type { ArcTermEnv } from "./env";
import type { ArcTerm } from "./main";

export class ArcTermConfig {
  env: ArcTermEnv;
  term: ArcTerm;

  constructor(e: ArcTermEnv, t: ArcTerm) {
    Log(`ArcTerm ${t.referenceId}`, `Creating new ArcTermConfig`);

    this.env = e;
    this.term = t;
  }

  readonly configPath = "./arcterm.conf";
  private readonly configKeys = [
    "prompt",
    "greeting",
    "logo",
    "promptColor",
    "gooseBumps",
    "textOnlyElevate",
  ];

  public getConfig() {
    const obj = {};

    for (const key of this.configKeys) {
      obj[key] = this.env[key];
    }

    return obj;
  }

  public loadConfig(json: object) {
    for (const key of this.configKeys) {
      const exists = this.env[key] != null && json;
      const isType = typeof this.env[key] == typeof json[key];

      if (exists && isType) this.env[key] = json[key];
    }
  }

  public async loadConfigFile() {
    if (!UserDataStore.get()) return;

    Log(`ArcTerm ${this.term.referenceId}`, `config.loadConfigFile: Getting ${this.configPath}`);

    const file = await readFile(this.configPath);

    if (!file) return this.writeConfig();

    const d = await blobToText(file.data);
    const json = tryJsonConvert<object>(d) as object;

    if (typeof json !== "object") return this.writeConfig();

    this.loadConfig(json);
  }

  public async writeConfig(): Promise<boolean> {
    Log(`ArcTerm ${this.term.referenceId}`, `config.writeConfig: Writing ${this.configPath}`);

    if (!UserToken.get()) return false;

    const data = {};

    for (const key of this.configKeys) {
      if (key != "gooseBumps" || (typeof this.env[key] === "boolean" && this.env[key] == true))
        data[key] = this.env[key];
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    return await writeFile(this.configPath, blob);
  }
}
