import { BasePlugin, PluginDecorator } from "@/base/base.plugin";
import VideoStore from "@/stores/common/video.store";
import FullSvg from "@/assets/full.svg";
import FullExitSvg from "@/assets/full-exit.svg";
import CtrlStore from "@/stores/common/ctrl.store";
import "@/styles/plugin/ctrl/full.less";
import { reaction } from "mobx";
import bind from "bind-decorator";
import PortStore from "@/stores/common/port.store";

@PluginDecorator([VideoStore, CtrlStore, PortStore])
export default class FullPlugin extends BasePlugin<
  [VideoStore, CtrlStore, PortStore]
> {
  private fullButton: HTMLElement;

  protected onInit(): void {
    this.renderTemplate();
    this.addEventListener();

    reaction(
      () => this.store.portStore.isFull,
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
    if (this.store.portStore.isFull) {
      this.store.portStore.exitFullScreen();
    } else {
      this.store.portStore.fullScreen();
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

    this.store.ctrlStore.renderCtrlBtn(
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
