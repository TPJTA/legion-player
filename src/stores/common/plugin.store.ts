import {
  BaseStore,
  BaseStoreConstructor,
  StoreDecorator,
} from "@/base/base.store";
import {
  BasePlugin,
  BasePluginConstructor,
  lazyBasePluginConstructor,
} from "@/base/base.plugin";
import { VideoStore } from "@/stores/common/video.store";
import { ConfigStore } from "./config.store";
import { when } from "mobx";
import { commonPlugin } from "@/conf/plugin.conf";

@StoreDecorator([VideoStore, ConfigStore])
export class PluginStore extends BaseStore<null, [VideoStore, ConfigStore]> {
  readonly name = "pluginStore";
  private isDestory = false;
  private subPlugin: Map<BasePluginConstructor, BasePlugin> = new Map();

  protected onInit(): void {
    const overTimePromise = new Promise((reslove) => {
      setTimeout(() => {
        reslove("");
      }, 2000);
    });
    Promise.race([
      when(() => this.store.videoStore.state.isMetadata),
      overTimePromise,
    ]).then(() => {
      this.initPlugin();
    });
  }

  private initPlugin() {
    const plugins = [...this.store.configStore.plugins, ...commonPlugin];
    plugins?.forEach(async (plugin) => {
      let pluginConstructor: BasePluginConstructor;

      if (plugin.prototype instanceof BasePlugin) {
        pluginConstructor = <BasePluginConstructor>plugin;
      } else {
        const loadPlugin = await (<lazyBasePluginConstructor>plugin)();
        pluginConstructor = loadPlugin.default;
      }
      if (!this.subPlugin.has(pluginConstructor)) {
        const depsStore: BaseStoreConstructor[] = Reflect.getMetadata(
          "depsStore",
          pluginConstructor
        );
        let depsStoreObj = {};
        depsStore?.forEach((i) => {
          depsStoreObj = Object.assign(
            depsStoreObj,
            this.rootPlayer.initStore(i)
          );
        });
        pluginConstructor.prototype.store = depsStoreObj;
        this.subPlugin.set(
          pluginConstructor,
          new pluginConstructor(this.rootPlayer)
        );
      }
    });
  }

  protected onDestory(): void {
    this.isDestory = true;
  }
}
