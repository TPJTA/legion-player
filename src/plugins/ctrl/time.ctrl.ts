import { BasePlugin, PluginDecorator } from "@/base/base.plugin";
import CtrlStore from "@/stores/common/ctrl.store";
import VideoStore from "@/stores/common/video.store";
import { formatSeconds } from "@/utility/tools";
import { reaction } from "mobx";
import "@/styles/plugin/ctrl/time.less";

@PluginDecorator
export default class TimeCtrlPulgin extends BasePlugin {
  private nodes: {
    current: HTMLElement;
    durction: HTMLElement;
  };

  constructor(private videoStore: VideoStore, private ctrlStore: CtrlStore) {
    super();
    this.renderTemplate();

    reaction(
      () => this.videoStore.state.currentTime,
      (time) => {
        this.nodes.current.innerHTML = formatSeconds(time);
      },
      {
        fireImmediately: true,
      }
    );

    reaction(
      () => this.videoStore.state.duration,
      (time) => {
        this.nodes.durction.innerHTML = formatSeconds(time);
      },
      {
        fireImmediately: true,
      }
    );
  }

  private renderTemplate() {
    const warp = document.createElement("div");
    const ppx = this.ppx;
    warp.className = `${ppx}-ctrl-time`;
    warp.innerHTML = `
        <span class="${ppx}-ctrl-time-current">00:00</span>
        <span class="${ppx}-ctrl-time-separator">/</span>
        <span class="${ppx}-ctrl-time-durction">00:00</span>
    `;
    this.nodes = {
      current: warp.querySelector(`.${ppx}-ctrl-time-current`),
      durction: warp.querySelector(`.${ppx}-ctrl-time-durction`),
    };
    this.ctrlStore.renderCtrlBtn({ ele: warp }, "left", 2);
  }
}
