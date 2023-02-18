import { BaseStore, StoreDecorator } from "@/base/base.store";
import VideoStore from "@/stores/common/video.store";
import "@/styles/stores/ctrl.less";
import bind from "bind-decorator";
import { reaction } from "mobx";

const CtrlStoreDefaultState = {
  hide: true,
};
type CtrlBtn = { ele: HTMLElement; tooltip?: HTMLElement };

@StoreDecorator
export default class CtrlStore extends BaseStore<typeof CtrlStoreDefaultState> {
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
  private ctrlOver = false;

  constructor(private videoStore: VideoStore) {
    super();
    this.preloadDOM();

    reaction(
      () => this.state.hide,
      (hide) => {
        this.rootPlayer.nodes.container.setAttribute(
          "data-ctrl-hide",
          String(hide)
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
    { ele }: Pick<CtrlBtn, "ele">,
    position: "top",
    index?: number
  ): void;
  renderCtrlBtn(
    { ele, tooltip }: CtrlBtn,
    position: "left" | "right",
    index?: number
  ): void;
  renderCtrlBtn(
    { ele, tooltip }: CtrlBtn,
    position: "top" | "left" | "right",
    index?: number
  ) {
    const ctrlEle = document.createElement("div");
    ctrlEle.className = `${this.ppx}-ctrl-button`;
    ctrlEle.append(ele);
    if (tooltip) {
      this.renderTooltip(ctrlEle, tooltip);
    }

    if (typeof index == "number") {
      ctrlEle.setAttribute("data-index", index.toFixed());
      const children = this.nodes[position].children;
      for (let i = children.length - 1; i >= 0; i--) {
        const curIndex = parseInt(children[i].getAttribute("data-index"));

        if (Number.isNaN(curIndex)) {
          continue;
        } else if (curIndex < index) {
          children[i].insertAdjacentElement("afterend", ctrlEle);
          return;
        }
      }
      this.nodes[position].insertAdjacentElement("afterbegin", ctrlEle);
    } else {
      this.nodes[position].appendChild(ctrlEle);
    }
  }

  private renderTooltip(ctrlEle: HTMLElement, tooltip: HTMLElement) {
    const ctrlTooltipWarp = document.createElement("div");
    ctrlTooltipWarp.className = `${this.ppx}-ctrl-tooltip-warp`;
    const ctrlTooltip = document.createElement("div");
    ctrlTooltip.className = `${this.ppx}-ctrl-tooltip`;
    ctrlTooltip.appendChild(tooltip);
    ctrlTooltipWarp.appendChild(ctrlTooltip);

    const toolTipEvent = this.createToolTipEvent();
    ctrlEle.addEventListener("mouseenter", toolTipEvent);
    ctrlEle.addEventListener("mouseleave", toolTipEvent);

    ctrlEle.append(ctrlTooltipWarp);
  }

  private createToolTipEvent() {
    let hideTimer;
    const handle = (e: MouseEvent) => {
      const toolTip = (
        e.currentTarget as HTMLElement
      ).querySelector<HTMLElement>(`.${this.ppx}-ctrl-tooltip-warp`);
      if (toolTip) {
        hideTimer && window.clearTimeout(hideTimer);

        if (e.type === "mouseenter") {
          toolTip.classList.add(`${this.ppx}-ctrl-tooltip-warp-show`);
        } else {
          hideTimer = window.setTimeout(() => {
            toolTip.classList.remove(`${this.ppx}-ctrl-tooltip-warp-show`);
            hideTimer = null;
          }, 200);
        }
      }
    };
    return handle;
  }

  show() {
    this.setState({
      hide: false,
    });
  }

  hide() {
    this.setState({
      hide: true,
    });
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
    this.nodes.container.addEventListener("mouseleave", this.onContainerLeave);
  }

  @bind
  private onPrimarymove() {
    if (!this.ctrlOver) {
      this.hideTimer && window.clearTimeout(this.hideTimer);
      this.show();
      this.hideTimer = window.setTimeout(() => {
        this.hide();
      }, 3000);
    }
  }

  @bind
  private onPrimaryLeave() {
    window.clearTimeout(this.hideTimer);
    this.hide();
  }

  @bind
  private onContainerMove() {
    this.hideTimer && window.clearTimeout(this.hideTimer);
    this.hideTimer = null;
    this.show();
    this.ctrlOver = true;
  }

  @bind
  private onContainerLeave() {
    this.ctrlOver = false;
  }
}
