import { BasePlugin, PluginDecorator } from "@/base/base.plugin";
import CtrlStore from "@/stores/common/ctrl.store";
import VideoStore from "@/stores/common/video.store";
import "@/styles/plugin/ctrl/progress.less";
import { reaction } from "mobx";
@PluginDecorator([VideoStore, CtrlStore])
export default class ProgressPlugin extends BasePlugin<
  [VideoStore, CtrlStore]
> {
  private nodes: {
    warp: HTMLElement;
    progress: HTMLElement;
    buffer: HTMLElement;
    time: HTMLElement;
  };

  onInit() {
    this.renderTemplate();
    reaction(
      () => this.store.videoStore.state.bufferedTime,
      (buffTime) => {
        console.log();

        this.nodes.buffer.style.width =
          (buffTime / this.store.videoStore.state.duration) * 100 + "%";
      }
    );

    reaction(
      () => this.store.videoStore.state.currentTime,
      (currentTime) => {
        this.nodes.time.style.width =
          (currentTime / this.store.videoStore.state.duration) * 100 + "%";
      }
    );
  }

  private renderTemplate() {
    const ppx = this.ppx;
    const progress = document.createElement("div");
    progress.classList.add(`${ppx}-ctrl-progress`);
    progress.innerHTML = `
      <div class="${ppx}-ctrl-progress-buffer"></div>
      <div class="${ppx}-ctrl-progress-time"></div>
    `;

    this.store.ctrlStore.nodes.progressWarp.appendChild(progress);
    this.nodes = {
      warp: this.store.ctrlStore.nodes.progressWarp,
      progress,
      buffer: progress.querySelector(`.${ppx}-ctrl-progress-buffer`),
      time: progress.querySelector(`.${ppx}-ctrl-progress-time`),
    };
  }
}
