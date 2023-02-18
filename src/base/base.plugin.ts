import { BaseStore, RootPlayer, BaseStoreConstructor } from "./base.store";
import { Events, CSS_PREFIX } from "@/conf/index.conf";

export type BasePluginConstructor = new (
  ...depsStore: BaseStore[]
) => BasePlugin;

export type lazyBasePluginConstructor = () => Promise<{
  default: BasePluginConstructor;
}>;

export class BasePlugin {
  /**
   * @description rootplay实例
   */
  rootPlayer: RootPlayer;

  /** @description css标识 */
  protected readonly ppx = CSS_PREFIX;

  constructor() {
    this.rootPlayer.on(Events.Player_Reload, this.onReload);
    this.rootPlayer.on(Events.Player_Destory, this.onDestory);
  }

  protected onInit() {}

  protected onReload() {}

  protected onDestory() {}
}
/**
 * @description store装饰器, 用于收集依赖的store
 */
export const PluginDecorator: ClassDecorator = (target) => {
  return target;
};
