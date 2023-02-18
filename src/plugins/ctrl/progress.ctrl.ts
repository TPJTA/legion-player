import { BasePlugin, PluginDecorator } from "@/base/base.plugin";
import { Events } from "@/conf/events.conf";
import CtrlStore from "@/stores/common/ctrl.store";
import PortStore from "@/stores/common/port.store";
import VideoStore from "@/stores/common/video.store";
import "@/styles/plugin/ctrl/progress.less";
import { formatSeconds } from "@/utility/tools";
import bind from "bind-decorator";
import { reaction } from "mobx";
@PluginDecorator
export default class ProgressPlugin extends BasePlugin {
  private nodes: {
    progress: HTMLElement;
    buffer: HTMLElement;
    time: HTMLElement;
    tooltip: HTMLElement;
  };

  constructor(
    private videoStore: VideoStore,
    private ctrlStore: CtrlStore,
    private portStore: PortStore
  ) {
    super();
    this.renderTemplate();
    reaction(
      () => this.videoStore.state.bufferedTime,
      (buffTime) => {
        this.nodes.buffer.style.width =
          (buffTime / this.videoStore.state.duration) * 100 + "%";
      }
    );

    reaction(
      () => this.videoStore.state.currentTime,
      (currentTime) => {
        if (!this.videoStore.state.seeking) {
          this.nodes.time.style.width =
            (currentTime / this.videoStore.state.duration) * 100 + "%";
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
      <div class="${ppx}-ctrl-progress-tooltip">00:00</div>
    `;

    this.ctrlStore.renderCtrlBtn({ ele: progress }, "top");
    this.nodes = {
      progress,
      buffer: progress.querySelector(`.${ppx}-ctrl-progress-buffer`),
      time: progress.querySelector(`.${ppx}-ctrl-progress-time`),
      tooltip: progress.querySelector(`.${ppx}-ctrl-progress-tooltip`),
    };
  }

  private addEventListener() {
    this.nodes.progress.addEventListener("mousemove", this.onMousemove);
    this.nodes.progress.addEventListener("mouseenter", this.onMouseenter);
    this.nodes.progress.addEventListener("mouseleave", this.onMouseleave);
    this.nodes.progress.addEventListener("mousedown", this.onMousedown);
  }

  private removeEventListener() {
    this.nodes.progress.removeEventListener("mouseenter", this.onMouseenter);
    this.nodes.progress.removeEventListener("mouseleave", this.onMouseleave);
    this.nodes.progress.removeEventListener("mousedown", this.onMousedown);
  }

  @bind
  private onMouseenter() {
    if (!this.ctrlStore.state.hide) {
      this.nodes.progress.classList.add(`${this.ppx}-ctrl-progress-over`);
    }
  }

  @bind
  private onMousemove(e) {
    if (!this.ctrlStore.state.hide && !this.videoStore.state.seeking) {
      this.setTooltipPosition(e.pageX);
    }
  }

  @bind
  private onMouseleave() {
    if (!this.videoStore.state.seeking) {
      this.nodes.progress.classList.remove(`${this.ppx}-ctrl-progress-over`);
      this.nodes.tooltip.style.display = "none";
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
    const progressLeft =
      this.nodes.progress.getBoundingClientRect().x +
      document.documentElement.scrollLeft;
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

    this.setTooltipPosition(offsetX);
  }

  private setTooltipPosition(offsetX: number) {
    this.nodes.tooltip.style.display = "block";
    const progressLeft =
      this.nodes.progress.getBoundingClientRect().x +
      document.documentElement.scrollLeft;
    const progressRight = progressLeft + this.nodes.progress.offsetWidth;
    const halfClientWidth = this.nodes.tooltip.offsetWidth / 2;
    let left = 0;
    let percent = 0;
    if (progressLeft >= offsetX) {
      percent = 0;
      left = 0;
    } else if (progressRight <= offsetX) {
      percent = 1;
      left = progressRight - progressLeft - this.nodes.tooltip.clientWidth;
    } else {
      percent = (offsetX - progressLeft) / this.nodes.progress.offsetWidth;
      if (progressLeft + halfClientWidth >= offsetX) {
        left = 0;
      } else if (progressRight - halfClientWidth <= offsetX) {
        left = progressRight - progressLeft - this.nodes.tooltip.clientWidth;
      } else {
        left = offsetX - progressLeft - halfClientWidth;
      }
    }

    this.nodes.tooltip.innerHTML = formatSeconds(
      this.videoStore.state.duration * percent
    );
    this.nodes.tooltip.style.left = left + "px";
  }

  @bind
  private progressDragEnd() {
    const percent = parseFloat(this.nodes.time.style.width);
    const time = (this.videoStore.state.duration * percent) / 100;
    this.nodes.progress.classList.remove(`${this.ppx}-ctrl-progress-over`);
    this.nodes.tooltip.style.display = "none";
    this.portStore.seek(time, true);
    this.rootPlayer.emit(Events.Player_seeked);
    window.removeEventListener("mousemove", this.progressDrag);
    window.removeEventListener("mouseup", this.progressDragEnd);
  }

  protected onDestory(): void {
    this.removeEventListener();
  }
}
