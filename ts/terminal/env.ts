import { Log } from "$ts/console";
import { LogLevel } from "$types/console";
import { ArcTermConfig } from "./config";
import type { Color } from "./interface";
import type { ArcTerm } from "./main";

export class ArcTermEnv {
  config: ArcTermConfig;
  prompt = "[$username]: [~/$pwd] $ ";
  promptColor: Color = "green";
  greeting = `ArcTerm & ArcOS v$version\n\nLicensed under GPLv3. Created by the ArcOS team.`;
  logo: boolean = true;
  gooseBumps: boolean = false;
  textOnlyElevate: boolean = false;

  constructor(term: ArcTerm) {
    Log(`ArcTerm ${term.referenceId}`, `Creating new ArcTermEnv`, LogLevel.info);

    this.config = new ArcTermConfig(this, term);
  }
}
