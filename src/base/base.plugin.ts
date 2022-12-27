import { BaseStore, RootPlayer, BaseStoreConstructor } from "./base.store";
import { Events, CSS_PREFIX } from "@/conf/index.conf";

export type BasePluginConstructor = new (rootPlayer: RootPlayer) => BasePlugin;
export type lazyBasePluginConstructor = () => Promise<{
  default: BasePluginConstructor;
}>;

export class BasePlugin<depStore extends BaseStore[] = any> {
  /**
   * @description rootplay实例
   */
  protected rootPlayer: RootPlayer;

  /** @description css标识 */
  protected readonly ppx = CSS_PREFIX;

  /**
   * @description 依赖的其他store
   */
  store: {
    [key in depStore[number]["name"]]: Extract<depStore[number], { name: key }>;
  };

  constructor(rootPlayer: RootPlayer) {
    this.rootPlayer = rootPlayer;
    this.onInit();
    rootPlayer.on(Events.Player_Reload, this.onReload);
    rootPlayer.on(Events.Player_Destory, this.onDestory);
  }

  protected onInit() {}

  protected onReload() {}

  protected onDestory() {}
}
/**
 * @description store装饰器, 用于收集依赖的store
 */
export function PluginDecorator(
  depsStore?: BaseStoreConstructor[]
): ClassDecorator {
  return (constructor) => {
    Reflect.defineMetadata("depsStore", depsStore, constructor);
  };
}
