import { BasePlugin, PluginDecorator } from "@/base/base.plugin";
import { Events } from "@/conf/events.conf";
import CtrlStore from "@/stores/common/ctrl.store";
import PortStore from "@/stores/common/port.store";
import VideoStore from "@/stores/common/video.store";
import "@/styles/plugin/ctrl/progress.less";
import bind from "bind-decorator";
import { reaction } from "mobx";
@PluginDecorator([VideoStore, CtrlStore, PortStore])
export default class ProgressPlugin extends BasePlugin<
  [VideoStore, CtrlStore, PortStore]
> {
  private nodes: {
    progress: HTMLElement;
    buffer: HTMLElement;
    time: HTMLElement;
  };

  onInit() {
    this.renderTemplate();
    reaction(
      () => this.store.videoStore.state.bufferedTime,
      (buffTime) => {
        this.nodes.buffer.style.width =
          (buffTime / this.store.videoStore.state.duration) * 100 + "%";
      }
    );

    reaction(
      () => this.store.videoStore.state.currentTime,
      (currentTime) => {
        if (!this.store.videoStore.state.seeking) {
          this.nodes.time.style.width =
            (currentTime / this.store.videoStore.state.duration) * 100 + "%";
        }
      }
    );
    this.addEventListener();
  }

  private renderTemplate() {
    const ppx = this.ppx;
    const progress = document.createElement("div");
    progress.classList.add(`${ppx}-ctrl-progress`);
    progress.innerHTML = `
      <div class="${ppx}-ctrl-progress-buffer"></div>
      <div class="${ppx}-ctrl-progress-time">
        <div class="${ppx}-ctrl-progress-time-icon"></div>
      </div>
    `;

    this.store.ctrlStore.renderCtrlBtn(progress, "top");
    this.nodes = {
      progress,
      buffer: progress.querySelector(`.${ppx}-ctrl-progress-buffer`),
      time: progress.querySelector(`.${ppx}-ctrl-progress-time`),
    };
  }

  private addEventListener() {
    this.nodes.progress.addEventListener("mouseenter", this.onMousemove);
    this.nodes.progress.addEventListener("mouseleave", this.onMouseout);
    this.nodes.progress.addEventListener("mousedown", this.onMousedown);
  }

  private removeEventListener() {
    this.nodes.progress.removeEventListener("mouseenter", this.onMousemove);
    this.nodes.progress.removeEventListener("mouseleave", this.onMouseout);
  }

  @bind
  private onMousemove(e) {
    if (!this.store.ctrlStore.state.hide) {
      this.nodes.progress.classList.add(`${this.ppx}-ctrl-progress-over`);
    }
  }

  @bind
  private onMouseout() {
    if (!this.store.videoStore.state.seeking) {
      this.nodes.progress.classList.remove(`${this.ppx}-ctrl-progress-over`);
    }
  }

  @bind
  private onMousedown(e: MouseEvent) {
    this.rootPlayer.emit(Events.Player_seeking);
    this.setDragPosition(e.pageX);
    this.nodes.progress.classList.add(`${this.ppx}-ctrl-progress-over`);
    window.addEventListener("mousemove", this.progressDrag);
    window.addEventListener("mouseup", this.progressDragEnd);
    e.preventDefault();
  }

  @bind
  private progressDrag(e: MouseEvent) {
    this.rootPlayer.emit(Events.Player_seeking);
    this.setDragPosition(e.pageX);
  }

  private setDragPosition(offsetX: number) {
    const progressLeft = this.nodes.progress.getBoundingClientRect().x;
    const progressRight = progressLeft + this.nodes.progress.offsetWidth;
    if (progressLeft >= offsetX) {
      this.nodes.time.style.width = 0 + "%";
    } else if (progressRight <= offsetX) {
      this.nodes.time.style.width = 100 + "%";
    } else {
      this.nodes.time.style.width =
        ((offsetX - progressLeft) / this.nodes.progress.offsetWidth) * 100 +
        "%";
    }
  }

  @bind
  private progressDragEnd() {
    const percent = parseFloat(this.nodes.time.style.width);
    const time = (this.store.videoStore.state.duration * percent) / 100;
    this.nodes.progress.classList.remove(`${this.ppx}-ctrl-progress-over`);
    this.store.portStore.seek(time, true);
    this.rootPlayer.emit(Events.Player_seeked);
    window.removeEventListener("mousemove", this.progressDrag);
    window.removeEventListener("mouseup", this.progressDragEnd);
  }

  protected onDestory(): void {
    this.removeEventListener();
  }
}
