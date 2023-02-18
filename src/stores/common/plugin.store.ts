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
import VideoStore from "@/stores/common/video.store";
import ConfigStore from "./config.store";
import { when } from "mobx";
import { commonPlugin } from "@/conf/plugin.conf";

@StoreDecorator
export default class PluginStore extends BaseStore<null> {
  private isDestory = false;
  private subPlugin: Map<BasePluginConstructor, BasePlugin> = new Map();

  constructor(
    private videoStore: VideoStore,
    private configStore: ConfigStore
  ) {
    super();
    BasePlugin.prototype.rootPlayer = this.rootPlayer;
    const overTimePromise = new Promise((reslove) => {
      setTimeout(() => {
        reslove("");
      }, 5000);
    });
    Promise.race([
      when(() => this.videoStore.state.isMetadata),
      overTimePromise,
    ]).then(() => {
      this.initPlugin();
    });
  }

  private initPlugin() {
    const plugins = [...this.configStore.plugins, ...commonPlugin];
    plugins?.forEach(async (plugin) => {
      let pluginConstructor: BasePluginConstructor;

      if (plugin.prototype instanceof BasePlugin) {
        pluginConstructor = <BasePluginConstructor>plugin;
      } else {
        const loadPlugin = await (<lazyBasePluginConstructor>plugin)();
        pluginConstructor = loadPlugin.default;
        if (!pluginConstructor) {
          throw new Error("lazy plugin error, check the types of export");
        }
      }
      if (!this.isDestory && !this.subPlugin.has(pluginConstructor)) {
        const depsStore: BaseStoreConstructor[] = Reflect.getMetadata(
          "design:paramtypes",
          pluginConstructor
        );
        let depsStoreInstance: BaseStore[] = [];
        if (depsStore) {
          depsStoreInstance = depsStore.map((dep) =>
            this.rootPlayer.initStore(dep)
          );
        }
        this.subPlugin.set(
          pluginConstructor,
          new pluginConstructor(...depsStoreInstance)
        );
      }
    });
  }

  protected onDestory(): void {
    this.isDestory = true;
  }
}
