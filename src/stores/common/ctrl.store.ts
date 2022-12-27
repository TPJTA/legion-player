import { BaseStore, StoreDecorator } from "@/base/base.store";
import VideoStore from "@/stores/common/video.store";
import "@/styles/stores/ctrl.less";

@StoreDecorator([VideoStore])
export default class CtrlStore extends BaseStore<null, [VideoStore]> {
  readonly name = "ctrlStore";
  nodes: {
    container: HTMLElement;
    progressWarp: HTMLElement;
    ctrlLeft: HTMLElement;
    ctrlRight: HTMLElement;
  };

  onInit() {
    this.preloadDOM();
  }

  private preloadDOM() {
    const ppx = this.ppx;
    const container = document.createElement("div");
    container.classList.add(`${ppx}-ctrl-warp`);
    container.innerHTML = `
      <div class="${ppx}-ctrl">
        <div class="${ppx}-ctrl-progress-warp"></div>
        <div class="${ppx}-ctrl-left"></div>
        <div class="${ppx}-ctrl-right"></div>
      </div>
    `;
    this.rootPlayer.nodes.primary.appendChild(container);
    this.nodes = {
      container,
      progressWarp: container.querySelector(`.${ppx}-ctrl-progress-warp`),
      ctrlLeft: container.querySelector(`.${ppx}-ctrl-left`),
      ctrlRight: container.querySelector(`.${ppx}-ctrl-right`),
    };
  }
}
