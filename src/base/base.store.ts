import { RootPlayer } from "@/stores/root.store";
import { observable, action, runInAction } from "mobx";
import { Events, CSS_PREFIX } from "@/conf/index.conf";
import "reflect-metadata";

export { RootPlayer };
export type BaseStoreConstructor = new (rootPlayer: RootPlayer) => BaseStore;

export abstract class BaseStore<
  T extends object = any,
  depStore extends BaseStore[] = any
> {
  /** @description store标识 */
  abstract readonly name: string;

  /** @description css标识 */
  protected readonly ppx = CSS_PREFIX;

  /**
   * @description rootplay实例
   */
  protected rootPlayer: RootPlayer;

  /**
   * @description store 的状态，如需修改调用 `this.setState`
   */
  state: T;

  /**
   * @description 默认状态, 会在初始化或重载时传递给state
   */
  protected get defaultState(): T {
    return {} as T;
  }

  /**
   * @description 依赖的其他store
   */
  protected store: {
    [key in depStore[number]["name"]]: Extract<depStore[number], { name: key }>;
  };

  constructor(rootPlayer: RootPlayer) {
    this.state = observable.object(this.defaultState, null, { deep: false });
    this.rootPlayer = rootPlayer;
    this.onInit();
    rootPlayer.on(Events.Player_Reload, this.onReload);
    rootPlayer.on(Events.Player_Destory, this.onDestory);
  }

  @action
  setState(newState: Partial<T>) {
    runInAction(() => {
      for (const key in newState) {
        this.state[key] = newState[key];
      }
    });
  }

  /** @description 初始化完成调用 */
  protected onInit() {}

  /**
   * @description 播放器重载时自动调用
   * @param preserveState 是否要在重载时保留之前的数据
   */
  protected onReload(preserveState?: { [key in keyof T]: boolean }) {
    const beforeState: Partial<T> = {};
    if (preserveState) {
      for (const key in preserveState) {
        if (preserveState[key]) {
          beforeState[key] = this.state[key];
        }
      }
    }
    this.setState({ ...this.defaultState, ...beforeState });
  }

  /**
   * @description 播放器销毁时自动调用
   */
  protected onDestory() {}
}

/**
 * @description store装饰器, 用于收集依赖的store
 */
export function StoreDecorator(
  depsStore?: BaseStoreConstructor[]
): ClassDecorator {
  return (constructor) => {
    Reflect.defineMetadata("depsStore", depsStore, constructor);
  };
}
