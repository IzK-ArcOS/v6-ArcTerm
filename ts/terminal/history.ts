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
      this.index = store.length - 1;

      return "";
    }

    console.log(mod, this.index, store[this.index])

    return store[this.index]
  }

  public getCurrentIndexItem(): string {
    return this.store[this.index] || "";
  }

  public appendToHistory(command: string, index = this.index) {
    const store = this.store.get();

    if (store[index] == command) return index;

    store.splice(index + 1, 0, command);

    this.store.set(store);

    this.index = this.index + 1 > store.length ? store.length - 1 : this.index + 1;

    console.log(this.store.get());

    return index;
  }

  public clear() {
    this.store.set([]);
    this.index = 0;
  }
}