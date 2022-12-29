import { BaseStore, StoreDecorator } from "@/base/base.store";
import VideoStore from "@/stores/common/video.store";
import "@/styles/stores/ctrl.less";
import bind from "bind-decorator";
import { reaction } from "mobx";

const CtrlStoreDefaultState = {
  hide: true,
};

@StoreDecorator([VideoStore])
export default class CtrlStore extends BaseStore<
  typeof CtrlStoreDefaultState,
  [VideoStore]
> {
  readonly name = "ctrlStore";
  get defaultState() {
    return CtrlStoreDefaultState;
  }
  private nodes: {
    container: HTMLElement;
    top: HTMLElement;
    left: HTMLElement;
    right: HTMLElement;
  };
  private hideTimer: number;

  protected onInit() {
    this.preloadDOM();

    reaction(
      () => this.state.hide,
      (hide) => {
        this.nodes.container.classList[hide ? "add" : "remove"](
          `${this.ppx}-ctrl-warp-hide`
        );
      },
      {
        fireImmediately: true,
      }
    );
    this.addEventListener();
  }

  /**
   * @description 渲染ctrl上的按钮
   * @param ele 渲染的元素
   * @param position 渲染的位置
   * @param index 序号，序号越大排的越后，不填默认最后一个
   */
  renderCtrlBtn(
    ele: HTMLElement,
    position: "top" | "left" | "right",
    index?: number
  ) {
    if (typeof index == "number") {
      ele.setAttribute("data-index", index.toFixed());
      const children = this.nodes[position].children;
      for (let i = children.length - 1; i >= 0; i--) {
        const curIndex = parseInt(children[i].getAttribute("data-index"));

        if (Number.isNaN(curIndex)) {
          continue;
        } else if (curIndex < index) {
          children[i].insertAdjacentElement("afterend", ele);
          return;
        }
      }
      this.nodes[position].insertAdjacentElement("afterbegin", ele);
    } else {
      this.nodes[position].appendChild(ele);
    }
  }

  private preloadDOM() {
    const ppx = this.ppx;
    const container = document.createElement("div");
    container.classList.add(`${ppx}-ctrl-warp`);
    container.innerHTML = `
      <div class="${ppx}-ctrl">
        <div class="${ppx}-ctrl-top"></div>
        <div class="${ppx}-ctrl-left"></div>
        <div class="${ppx}-ctrl-right"></div>
      </div>
    `;
    this.rootPlayer.nodes.primary.appendChild(container);
    this.nodes = {
      container,
      top: container.querySelector(`.${ppx}-ctrl-top`),
      left: container.querySelector(`.${ppx}-ctrl-left`),
      right: container.querySelector(`.${ppx}-ctrl-right`),
    };
  }

  private addEventListener() {
    this.rootPlayer.nodes.primary.addEventListener(
      "mousemove",
      this.onPrimarymove
    );
    this.rootPlayer.nodes.primary.addEventListener(
      "mouseleave",
      this.onPrimaryLeave
    );
    this.nodes.container.addEventListener("mousemove", this.onContainerMove);
  }

  @bind
  private onPrimarymove() {
    this.hideTimer && window.clearTimeout(this.hideTimer);
    this.setState({
      hide: false,
    });
    this.hideTimer = window.setTimeout(() => {
      this.setState({
        hide: true,
      });
    }, 3000);
  }

  @bind
  private onPrimaryLeave() {
    window.clearTimeout(this.hideTimer);
    this.setState({
      hide: true,
    });
  }

  @bind
  private onContainerMove(e: MouseEvent) {
    this.hideTimer && window.clearTimeout(this.hideTimer);
    this.hideTimer = null;
    this.setState({
      hide: false,
    });
    e.stopPropagation();
  }
}
