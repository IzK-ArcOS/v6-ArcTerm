import { get } from "svelte/store";
import type { ArcTermEnv } from "./env";
import type { ArcTerm } from "./main";
import { Log } from "$ts/console";
import { UserDataStore } from "$ts/stores/user";
import { readFile, writeFile } from "$ts/server/fs/file";
import { arrayToText } from "$ts/server/fs/convert";

export class ArcTermConfig {
  env: ArcTermEnv;
  term: ArcTerm;

  constructor(e: ArcTermEnv, t: ArcTerm) {
    Log(`ArcTerm ${t.referenceId}`, `Creating new ArcTermConfig`);

    this.env = e;
    this.term = t;
    this.loadConfigFile();
  }

  readonly configPath = "./arcterm.conf";
  private readonly configKeys = [
    "prompt",
    "greeting",
    "logo",
    "promptColor",
    "gooseBumps",
  ];

  public getConfig() {
    const obj = {};

    for (let i = 0; i < this.configKeys.length; i++) {
      const k = this.configKeys[i];

      obj[k] = this.env[k];
    }

    return obj;
  }

  public loadConfig(json: object) {
    for (let i = 0; i < this.configKeys.length; i++) {
      const k = this.configKeys[i];

      const exists = this.env[k] != null && json;
      const isType = typeof this.env[k] == typeof json[k];

      if (exists && isType) this.env[k] = json[k];
    }
  }

  public async loadConfigFile() {
    Log(
      `ArcTerm ${this.term.referenceId}`,
      `config.loadConfigFile: Getting ${this.configPath}`
    );

    if (!UserDataStore.get()) return;

    const file = await readFile(this.configPath);

    if (!file) return this.writeConfig();

    const d = arrayToText(file.data);

    let json;

    try {
      json = JSON.parse(d);
    } catch {
      json = {};
    }

    this.loadConfig(json);
  }

  public async writeConfig() {
    Log(
      `ArcTerm ${this.term.referenceId}`,
      `config.writeConfig: Writing ${this.configPath}`
    );

    const data = {};

    for (let i = 0; i < this.configKeys.length; i++) {
      const k = this.configKeys[i];

      if (
        k != "gooseBumps" ||
        (typeof this.env[k] === "boolean" && this.env[k] == true)
      )
        data[k] = this.env[k];
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    await writeFile(this.configPath, blob);
  }
}
