import { BasePlugin, PluginDecorator } from "@/base/base.plugin";
import PortStore from "@/stores/common/port.store";
import PlaySvg from "@/assets/play.svg";
import PauseSvg from "@/assets/pause.svg";
import CtrlStore from "@/stores/common/ctrl.store";
import "@/styles/plugin/ctrl/play.less";
import { reaction } from "mobx";
import VideoStore from "@/stores/common/video.store";
import bind from "bind-decorator";

@PluginDecorator([PortStore, CtrlStore, VideoStore])
export default class PlayPlugin extends BasePlugin<
  [PortStore, CtrlStore, VideoStore]
> {
  private playButton: HTMLElement;

  protected onInit(): void {
    this.renderTemplate();

    reaction(
      () => this.store.videoStore.state.paused,
      (paused) => {
        this.playButton.classList[paused ? "add" : "remove"](
          `${this.ppx}-ctrl-pause`
        );
      },
      {
        fireImmediately: true,
      }
    );

    this.addEventListener();
  }

  private renderTemplate() {
    const ppx = this.ppx;
    const playButton = document.createElement("div");
    playButton.classList.add(`${ppx}-ctrl-play`);
    playButton.innerHTML = `
      <span class="${ppx}-ctrl-play-btn">
        ${PlaySvg}
      </span>
      <span class="${ppx}-ctrl-pause-btn">
        ${PauseSvg}
      </span>
    </div>
    `;
    this.playButton = playButton;
    this.store.ctrlStore.renderCtrlBtn({ ele: playButton }, "left", 1);
  }

  private addEventListener() {
    this.playButton.addEventListener("click", this.onClick);
  }

  private removeEventListener() {
    this.playButton.removeEventListener("click", this.onClick);
  }

  @bind
  private onClick() {
    if (this.store.videoStore.state.paused) {
      this.store.portStore.play();
    } else {
      this.store.portStore.pause();
    }
  }

  onDestory() {
    this.removeEventListener();
  }
}
