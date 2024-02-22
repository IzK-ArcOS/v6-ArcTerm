import { Log } from "$ts/console";
import { Store } from "$ts/writable";
import { ReadableStore } from "$types/writable";
import { ArcTerm } from "./main";

export class ArcTermHistory {
  public term: ArcTerm;
  public store: ReadableStore<string[]> = Store([]);
  public index = 0;

  constructor(term: ArcTerm) {
    Log(`ArcTerm ${term.referenceId}`, `Creating new ArcTermHistory`);

    this.term = term;
  }

  public changeIndexRelatively(mod: number) {
    this.index += mod;

    const store = this.store.get();

    if (this.index < 0 && mod < 0) {
      this.index = 0;
    }

    if (this.index > store.length - 1 && mod > 0) {
      this.index = store.length;

      return "";
    }

    return store[this.index] || "";
  }

  public getCurrentIndexItem(): string {
    return this.store[this.index] || "";
  }

  public append(command: string, index = this.index) {
    if (!command) return;

    const store = this.store.get();

    store.splice(index + 1, 0, command);

    this.store.set(store);
    this.index = this.index + 1 >= store.length - 1 ? store.length : this.index + 1;

    return index;
  }

  public clear() {
    this.store.set([]);
    this.index = 0;
  }
}
