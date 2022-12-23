import { RootPlayer } from "@/root.player";
import { observable, action } from "mobx";
import { Events, CSS_PREFIX } from "@/conf/index";

export class BaseStore<
  T extends Record<any, any> = null,
  depStore extends BaseStore[] = null
> {
  /** @description store标识 */
  readonly name: string;

  /** @description css标识 */
  protected readonly ppx = CSS_PREFIX;

  /**
   * rootplay实例
   */
  protected rootPlayer: RootPlayer;

  /**
   * @description store 的状态，如需修改调用 `this.setState`
   */
  @observable.shallow
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
    this.state = this.defaultState;
    this.name = Object.getPrototypeOf(this).constructor.name.toLowerCase();
    this.rootPlayer = rootPlayer;

    rootPlayer.on(Events.Player_Reload, this.onReload);
    rootPlayer.on(Events.Player_Destory, this.onDestory);
  }

  @action
  setState(newState: Partial<T>) {
    for (const key in newState) {
      this.state[key] = newState[key];
    }
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
 *
 * @param depsStore
 * @description
 */
export function StoreDecorator(depsStore?: typeof BaseStore[]): ClassDecorator {
  return (constructor) => {
    Reflect.defineMetadata("depsStore", depsStore, constructor);
  };
}
