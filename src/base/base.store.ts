import { RootPlayer } from "@/stores/root.store";
import { observable, action, runInAction } from "mobx";
import { Events, CSS_PREFIX } from "@/conf/index.conf";
import "reflect-metadata";

export { RootPlayer };
export type BaseStoreConstructor = new (...depsStore: BaseStore[]) => BaseStore;

export abstract class BaseStore<T extends object = any> {
  /** @description css标识 */
  protected readonly ppx = CSS_PREFIX;

  /**
   * @description rootplay实例
   */
  rootPlayer: RootPlayer;

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

  constructor() {
    this.state = observable.object(this.defaultState, null, { deep: false });
    this.rootPlayer.on(Events.Player_Reload, this.onReload);
    this.rootPlayer.on(Events.Player_Destory, this.onDestory);
  }

  @action
  setState(newState: Partial<T>) {
    runInAction(() => {
      for (const key in newState) {
        this.state[key] = newState[key];
      }
    });
  }

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
export const StoreDecorator: ClassDecorator = function (target) {
  return target;
};
