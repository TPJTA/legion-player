import { Configure, Events, EventName } from "@/conf/index.conf";
import { EventEmitter } from "events";
import { RootStore } from "@/stores/root.store";
import { TemplateNodes, createTemplate } from "@/utility/template";
import "@/styles/template.less";
export class RootPlayer {
  static events = Events;
  rootStore: RootStore;
  input: Configure = {} as Configure;
  private emitter: EventEmitter;
  nodes: TemplateNodes;

  constructor(input: Configure) {
    this.input = Object.assign(this.input, input);
    if (!this.input["element"]) {
      throw new Error("error player container");
    }
    this.nodes = createTemplate(this.input["element"]);
    this.emitter = new EventEmitter();
    this.rootStore = new RootStore(this);
  }

  get initStore() {
    return this.rootStore.initStore.bind(this.rootStore);
  }

  play() {
    return this.rootStore.portStore.play();
  }

  pause() {
    return this.rootStore.portStore.pause();
  }

  emit(event: string, ...args: any[]) {
    return this.emitter.emit(event, ...args);
  }

  on(event: string, listener: (...args: any) => void) {
    this.emitter.on(event, listener);
  }

  once(event: string, listener: (...args: any) => void) {
    this.emitter.once(event, listener);
  }

  off(event: string, listener: (...args: any) => void) {
    this.emitter.off(event, listener);
  }
}
