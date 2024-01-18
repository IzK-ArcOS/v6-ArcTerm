import { Log } from "$ts/console";
import { ProcessStack } from "$ts/stores/process";
import { sleep } from "$ts/util";
import { App } from "$types/app";
import { ArcTermCommandHandler } from "./commands";
import { ArcTermEnv } from "./env";
import { ArcTermInput } from "./input";
import type { CommandStore } from "./interface";
import { ArcTermScripts } from "./scripts";
import { ArcTermSections } from "./sect";
import { ArcTermStd } from "./std";
import { ArcTermUtil } from "./util";
import { ArcTermVariables } from "./var";

/**
 * @WARNING   This part of ArcOS is separated from the Svelte framework in
 *            order to make it easier to write and manage. Frequent checks
 *            are performed through ArcTerm classes in order to keep it clean
 *            and stop it from breaking unexpectedly.
 *
 * - IzKuipers, march 17 2023
 */

export class ArcTerm {
  target: HTMLDivElement;
  commands: CommandStore;
  app: App;
  std: ArcTermStd;
  util: ArcTermUtil;
  env: ArcTermEnv;
  vars: ArcTermVariables;
  input: ArcTermInput;
  path: string;
  scripts: ArcTermScripts;
  sect: ArcTermSections;
  commandHandler: ArcTermCommandHandler;
  referenceId: string;
  onload: (term: ArcTerm) => void;

  constructor(
    target: HTMLDivElement,
    store: CommandStore,
    app: App,
    public pid?: number,
    callback?: (term: ArcTerm) => void
  ) {
    this.target = target;
    this.commands = store;
    this.app = app;
    this.onload = callback;

    this.initialize();
  }

  public async initialize() {
    this.util = new ArcTermUtil(this);
    this.referenceId = this.util.getReference();

    Log(`ArcTerm ${this.referenceId}`, `Initializing new ArcTerm`);

    if (!this.target)
      throw new Error("Can't initialize ArcTerm without a valid target");

    this.target.innerText = "";

    this.target.removeAttribute("style");
    this.path = ".";
    this.commandHandler = new ArcTermCommandHandler(this);
    this.env = new ArcTermEnv(this);
    this.vars = new ArcTermVariables(this);
    this.scripts = new ArcTermScripts(this);
    this.sect = new ArcTermSections(this);

    await sleep(50);

    this.std = new ArcTermStd(this);
    this.input = new ArcTermInput(this);

    this.input.lock();

    if (this.onload) await this.onload(this);

    await this.env.config.loadConfigFile();

    if (!this.pid) return this.intro();

    const proc = ProcessStack.getProcess(this.pid)
    const args = proc.args;

    if (!args[0] || !Array.isArray(args[0])) return this.intro();

    this.std.clear();
    await this.input.processCommands(args[0]);
    this.input.unlock();
  }

  public intro() {
    this.util.flushAccent();
    this.input.unlock();
    this.util.intro();

    if (this.env.gooseBumps) this.std.Warning("GooseBumps 👀\n\n");
  }

  public dispose() {
    Log(`ArcTerm ${this.referenceId}`, "Disposing");

    if (!this.target) return;

    this.std.clear();
    this.std = null;
    this.env = null;
    this.input.lock();
    this.input = null;
  }

  public async reload() {
    Log(`ArcTerm ${this.referenceId}`, "Reloading");

    this.dispose(); // Dispose the current instance, locking ArcTerm

    // Re-initialize ArcTerm with the exact same initial parameters
    // after the next frame has advanced
    await sleep();
    await this.initialize();
  }
}
