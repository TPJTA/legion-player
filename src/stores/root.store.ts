import { RootPlayer } from "@/root.player";
import type { BaseStore } from "@/base/base.store";
import { Events, commonStores } from "@/conf/index";

export class RootStore {
  private rootPlayer: RootPlayer;
  private subStore: { [key in BaseStore["name"]]: BaseStore };

  constructor(rootPlayer: RootPlayer) {
    this.rootPlayer = rootPlayer;
    this.initSubStore();
    this.rootPlayer.emit(Events.Player_Init);
  }

  private initSubStore() {
    const initStore = (storeConstructor: typeof BaseStore) => {
      const depsStore: typeof BaseStore[] = Reflect.getMetadata(
        "depsStore",
        storeConstructor
      );
      if (depsStore) {
        for (const i of depsStore) {
          initStore(i);
        }
      }
      let store = new storeConstructor(this.rootPlayer);
      if (this.subStore[store.name]) {
        if (Object.getPrototypeOf(this).constructor !== storeConstructor) {
          throw new Error(
            "the name of the store is repeated, please change your store name"
          );
        }
        store = null;
      } else {
        this.subStore[store.name] = store;
      }
    };

    const stores = [...commonStores, ...this.rootPlayer.input.store];
    stores.forEach((s) => initStore(s));

    this.rootPlayer.emit(Events.Player_Store_Init);
  }
}
