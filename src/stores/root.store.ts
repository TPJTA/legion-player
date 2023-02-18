import { RootPlayer as IRootPlayer } from "@/root.player";
import { BaseStore, BaseStoreConstructor } from "@/base/base.store";
import { Events, commonStores } from "@/conf/index.conf";
import PortStore from "./common/port.store";

export type RootPlayer = IRootPlayer;
export class RootStore {
  private rootPlayer: RootPlayer;
  private subStore: Map<BaseStoreConstructor, BaseStore> = new Map();

  constructor(rootPlayer: RootPlayer) {
    this.rootPlayer = rootPlayer;
    BaseStore.prototype.rootPlayer = rootPlayer;
    this.initSubStore();
    this.rootPlayer.emit(Events.Player_Init);
  }

  private initSubStore() {
    const stores = [...commonStores];
    stores.forEach((s) => this.initStore(s));
    this.rootPlayer.emit(Events.Player_Store_Initialization);
  }

  get portStore() {
    return <PortStore>this.subStore.get(PortStore);
  }

  initStore(storeConstructor: BaseStoreConstructor) {
    let instanceStore: BaseStore;
    const depsStore: BaseStoreConstructor[] = Reflect.getMetadata(
      "design:paramtypes",
      storeConstructor
    );

    if (!this.subStore.has(storeConstructor)) {
      let depsStoreInstance: BaseStore[] = [];

      if (depsStore) {
        depsStoreInstance = depsStore.map((dep) => this.initStore(dep));
      }

      instanceStore = new storeConstructor(...depsStoreInstance);
      this.subStore.set(storeConstructor, instanceStore);
    } else {
      instanceStore = this.subStore.get(storeConstructor);
    }

    return instanceStore;
  }
}
