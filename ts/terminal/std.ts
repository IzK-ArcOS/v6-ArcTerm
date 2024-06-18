import { Log } from "$ts/console";
import { sleep } from "$ts/util";
import { App } from "$types/app";
import { LogLevel } from "$types/console";
import { writable } from "svelte/store";
import type { ArcTermEnv } from "./env";
import { ColorTranslations, type Color } from "./interface";
import type { ArcTerm } from "./main";
import { ArcTermStdSelect } from "./std/select";
import { COLOR_CHAR } from "./store";

export class ArcTermStd {
  target: HTMLDivElement;
  app: App;
  term: ArcTerm;
  env: ArcTermEnv;
  verbose = true;

  constructor(parent: ArcTerm) {
    Log(`ArcTerm ${parent.referenceId}`, `Creating new ArcTermStd`);

    this.target = parent.target;
    this.app = parent.app;
    this.term = parent;
    this.env = parent.env;
  }

  public write(str: string, target = this.target) {
    const el = this.writeLine(str, true, target);

    return el;
  }

  public writeLine(str: string, inline = false, target = this.target) {
    const el = document.createElement("div");

    el.className = "part";

    if (inline) el.className += " inline";

    el.innerText = str;

    target.appendChild(el);

    this.focusTarget();

    return el;
  }

  public writeHTML(str: string, inline = false, target = this.target) {
    const el = document.createElement("div");

    el.className = "part";

    if (inline) el.className += " inline";

    el.innerHTML = str;

    target.appendChild(el);

    this.focusTarget();

    return el;
  }

  public writeSeparator(length: number) {
    this.writeLine(``.padEnd(length, "-"));
  }

  public writeColor(
    str: string,
    pri: Color,
    sec: Color = "white",
    inline = false,
    target = this.target
  ) {
    const parts = str.split(/(\[[^\]]*\])/);
    const out = document.createElement("div");

    out.className = `part `;

    if (inline) out.className += " inline";

    for (const part of parts) {
      const element = document.createElement("span");
      const isPart = part.startsWith("[") && part.endsWith("]");
      const content = part.replaceAll("[", "").replaceAll("]", "");

      element.className = `clr-${isPart ? pri : sec}`;
      element.innerText = content;

      out.append(element);
    }

    target.append(out);

    this.focusTarget();

    return out;
  }

  public newWriteColor(str: string, inline = false, target = this.target) {
    let currentColor: Color = "white";

    for (let i = 0; i < str.length; i++) {
      if (str[i] == COLOR_CHAR) {
        if (!str[i + 1]) continue;

        const color = ColorTranslations[str[i + 1]];

        if (!color) continue;

        currentColor = color == "RESET" ? "white" : color;

        i++;
        continue;
      }

      this.writeColor(`[${str[i]}]`, currentColor, "white", true, target);
    }

    if (!inline) this.writeLine("", false, target);
  }

  public writeImage(src: string, height: number) {
    const el = document.createElement("img");

    el.className = "image";
    el.style.height = `${height}em`;
    el.src = src;

    this.target.append(el);

    this.focusTarget();
  }

  public update(el: HTMLDivElement, str: string) {
    if (!el) return false;

    el.innerText = "";

    this.write(str, this.target);
  }

  public updateColor(el: HTMLDivElement, str: string, pri: Color, sec: Color = "white") {
    if (!el) return false;

    el.innerText = "";

    this.writeColor(str, pri, sec, false, el);
  }

  public Error(context: string) {
    Log(
      `ArcTerm ${this.term.referenceId}`,
      `std.Error: ${context.replaceAll("\n", "\\n")}`,
      LogLevel.error
    );

    if (!this.verbose) return;

    this.writeColor(`[Error]: ${context}`, "red");
  }

  public Warning(context: string) {
    Log(
      `ArcTerm ${this.term.referenceId}`,
      `std.Warning: ${context.replaceAll("\n", "\\n")}`,
      LogLevel.warn
    );

    if (!this.verbose) return;

    this.writeColor(`[Warning]: ${context}`, "orange");
  }

  public Info(context: string) {
    Log(
      `std.ArcTerm ${this.term.referenceId}`,
      `Info: ${context.replaceAll("\n", "\\n")}`,
      LogLevel.info
    );

    if (!this.verbose) return;

    this.writeColor(`[Info]: ${context}`, "blue");
  }

  public async read(
    prefix: string,
    suffix: string,
    max: number,
    pswd = false,
    value = "",
    target: HTMLDivElement = this.target
  ): Promise<string> {
    if (!this.target) return "asdf";

    Log(`ArcTerm ${this.term.referenceId}`, `std.read: ${prefix}${suffix}`, LogLevel.info);

    const current = this.term.input.current;
    const commit = writable<boolean>(false);
    const wrapper = document.createElement("div");
    const input = document.createElement("input");

    if (pswd) input.type = "password";

    input.style.width = `${max * 8.41}px`;
    input.maxLength = max;
    input.value = value;

    wrapper.className = "userinput";
    wrapper.append(prefix, input, suffix);

    target.append(wrapper);
    this.term.input.current = input;

    await sleep(10);

    this.focusInput();

    input.addEventListener("keydown", (e) => {
      if (!e.key) return;

      const key = e.key.toLowerCase();

      if (key != "enter") return;

      input.disabled = true;
      commit.set(true);
    });

    return new Promise<string>((resolve) => {
      commit.subscribe((v) => {
        if (!v) return;

        this.term.input.current = current;
        resolve(input.value);
      });
    });
  }

  public initTarget() {
    this.target.innerText = "";

    const trigger = document.createElement("div");

    trigger.className = "click-trigger";

    this.target.addEventListener("click", () => this.focusInput());
    this.target.append(trigger);
  }

  public focusInput() {
    if (!this.term || !this.term.input || !this.term.input.current) return;

    this.term.input.current.focus();

    this.focusTarget();
  }

  public focusTarget() {
    if (!this.target) return;

    this.target.scrollTo(0, this.target.scrollHeight);
  }

  public clear() {
    this.initTarget();
  }

  public async select(options: string[], color?: Color, target = this.target): Promise<number> {
    const select = new ArcTermStdSelect(this, color, target);

    return await select.create(options);
  }
}
