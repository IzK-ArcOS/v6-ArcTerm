import { Log } from "$ts/console";
import { sleep } from "$ts/util";
import type { ArcTermEnv } from "./env";
import type { ArcTerm } from "./main";

export class ArcTermInput {
  lockInput = false;
  target: HTMLDivElement;
  env: ArcTermEnv;
  term: ArcTerm;
  current: HTMLInputElement;

  constructor(T: ArcTerm) {
    Log(`ArcTerm ${T.referenceId}`, `Creating new ArcTermInput`);

    this.target = T.target;
    this.env = T.env;
    this.term = T;

    this.commandLoop();
  }

  public commandLoop() {
    Log(`ArcTerm ${this.term.referenceId}`, `input.commandLoop: Starting command loop`);

    setInterval(() => {
      if (this.lockInput) return;

      this.lock();

      const prompt = this.createPrompt();

      if (!prompt) return;

      this.target.append(prompt);
    }, 10);
  }

  public lock() {
    this.lockInput = true;
  }

  public unlock() {
    this.lockInput = false;
  }

  private getPrompt() {
    return this.term.vars.replace(this.env.prompt);
  }

  public createPrompt() {
    Log(`ArcTerm ${this.term.referenceId}`, `input.createPrompt`);

    if (this.current) this.current.disabled = true;

    if (!this.term.std) return;

    const wrap = document.createElement("div");
    const inner = document.createElement("div");
    const input = document.createElement("input");

    wrap.className = "prompt";

    if (this.term.std.verbose)
      this.term.std.writeColor(this.getPrompt(), this.env.promptColor, "white", true, wrap);

    input.id = `input#${Math.floor(Math.random() * 1e9)}`;
    input.spellcheck = false;
    input.addEventListener("keydown", (e) => this.processInputEvent(e, input));

    this.current = input;

    inner.className = "inner";
    inner.append(input);

    wrap.append(inner);

    setTimeout(() => {
      this.term.std.focusInput();
    });

    return wrap;
  }

  private async processInputEvent(e: KeyboardEvent, input: HTMLInputElement) {
    if (!e || !input) return;

    const split = input.value.split("&&");
    const key = e.key.toLowerCase();

    switch (key) {
      case "enter":
        this.term.history.append(input.value);
        this.processCommands(split);
        break;
      case "arrowup":
        input.value = this.term.history.changeIndexRelatively(-1);
        await sleep(0);
        input.setSelectionRange(input.value.length, input.value.length);
        return;
      case "arrowdown":
        input.value = this.term.history.changeIndexRelatively(1);
        await sleep(0);
        input.setSelectionRange(input.value.length, input.value.length);
        return;
    }
  }

  public async processCommands(lines: string[], file = "") {
    await sleep();

    for (const line of lines) {
      const str = this.term.vars.replace(line.trim());
      const args = str.split(" ");
      const cmd = args[0];

      if (cmd.trim() == "exit" && file) return false;

      if (cmd.startsWith("#") || !cmd) continue;

      args.shift();

      const success = await this.term.commandHandler.evaluate(cmd, args, !!file);

      if (!success) {
        return false;
      }

      this.lock();

      await sleep();
    }

    this.unlock();

    return true;
  }
}
