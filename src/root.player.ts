import { Configure, Events } from "@/conf/index";
import { EventEmitter } from "events";
import { RootStore } from "@/stores/root.store";
import "reflect-metadata";

export class RootPlayer {
  RootStore: RootStore;
  input: Configure;
  private emitter: EventEmitter;
  container: HTMLElement;

  constructor(input: Configure) {
    this.input = Object.assign(this.input, input);
    if (!this.input["element"]) {
      throw new Error("error player container");
    }
    this.container = this.input["element"];
    this.emitter = new EventEmitter();
    this.RootStore = new RootStore(this);
  }

  emit(event: Events, ...args: any[]) {
    return this.emitter.emit(event, ...args);
  }

  on(event: Events, listener: (...args: any) => void) {
    this.emitter.on(event, listener);
  }

  once(event: Events, listener: (...args: any) => void) {
    this.emitter.once(event, listener);
  }

  off(event: Events, listener: (...args: any) => void) {
    this.emitter.off(event, listener);
  }
}
