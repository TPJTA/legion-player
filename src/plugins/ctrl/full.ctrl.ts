import { BasePlugin, PluginDecorator } from "@/base/base.plugin";
import VideoStore from "@/stores/common/video.store";
import FullSvg from "@/assets/full.svg";
import FullExitSvg from "@/assets/full-exit.svg";
import CtrlStore from "@/stores/common/ctrl.store";
import "@/styles/plugin/ctrl/full.less";
import { reaction } from "mobx";
import bind from "bind-decorator";
import PortStore from "@/stores/common/port.store";

@PluginDecorator
export default class FullPlugin extends BasePlugin {
  private fullButton: HTMLElement;

  constructor(
    private videoStore: VideoStore,
    private ctrlStore: CtrlStore,
    private portStore: PortStore
  ) {
    super();
    this.renderTemplate();
    this.addEventListener();

    reaction(
      () => this.portStore.isFull,
      (isFull) => {
        this.fullButton.classList[isFull ? "add" : "remove"](
          `${this.ppx}-ctrl-full-exit`
        );
      },
      {
        fireImmediately: true,
      }
    );
  }

  private addEventListener() {
    this.fullButton.addEventListener("click", this.onClick);
  }

  private removeEventListener() {
    this.fullButton.removeEventListener("click", this.onClick);
  }

  @bind
  onClick() {
    if (this.portStore.isFull) {
      this.portStore.exitFullScreen();
    } else {
      this.portStore.fullScreen();
    }
  }

  private renderTemplate() {
    const ppx = this.ppx;

    const fullButton = document.createElement("div");
    fullButton.classList.add(`${ppx}-ctrl-full`);
    fullButton.innerHTML = `
      <span class="${ppx}-ctrl-full-btn">
        ${FullSvg}
      </span>
      <span class="${ppx}-ctrl-full-exit-btn">
        ${FullExitSvg}
      </span>
    </div>
    `;

    const fullTooltip = document.createElement("div");
    fullTooltip.classList.add(`${ppx}-ctrl-full-tooltip`);
    fullTooltip.innerHTML = "全屏";

    this.ctrlStore.renderCtrlBtn(
      { ele: fullButton, tooltip: fullTooltip },
      "right",
      10
    );
    this.fullButton = fullButton;
  }

  protected onDestory(): void {
    this.removeEventListener();
  }
}
