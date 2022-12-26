import { RootPlayer as IRootPlayer } from "@/root.player";
import type { BaseStore, BaseStoreConstructor } from "@/base/base.store";
import { Events, commonStores } from "@/conf/index.conf";

export type RootPlayer = IRootPlayer;
export class RootStore {
  private rootPlayer: RootPlayer;
  private subStore: Map<BaseStoreConstructor, BaseStore> = new Map();

  constructor(rootPlayer: RootPlayer) {
    this.rootPlayer = rootPlayer;
    this.initSubStore();
    this.rootPlayer.emit(Events.Player_Init);
  }

  private initSubStore() {
    const stores = [...commonStores];
    stores.forEach((s) => this.initStore(s));
    this.rootPlayer.emit(Events.Player_Store_Initialization);
  }

  initStore(storeConstructor: BaseStoreConstructor) {
    const depsStore: BaseStoreConstructor[] = Reflect.getMetadata(
      "depsStore",
      storeConstructor
    );
    const depsStoreObj = {};

    if (!this.subStore.has(storeConstructor)) {
      if (depsStore) {
        for (const i of depsStore) {
          this.initStore(i);
        }
      }
      depsStore?.forEach((i) => {
        const store = this.subStore.get(i);
        if (store.name) {
          depsStoreObj[store.name] = store;
        }
      });
      storeConstructor.prototype.store = depsStoreObj;

      const store = new storeConstructor(this.rootPlayer);
      if (!store.name) {
        console.error(
          `The ${storeConstructor.name} has no name, Please set a name`
        );
      }
      this.subStore.set(storeConstructor, store);

      depsStoreObj[store.name] = store;
    } else {
      const curStore = this.subStore.get(storeConstructor);
      depsStoreObj[curStore.name] = curStore;
      depsStore?.forEach((i) => {
        const store = this.subStore.get(i);
        if (store.name) {
          depsStoreObj[store.name] = store;
        }
      });
    }
    return depsStoreObj;
  }
}
