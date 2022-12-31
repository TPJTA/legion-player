/** @file 封装video的各种api */
import { BaseStore, StoreDecorator } from "@/base/base.store";
import VideoStore from "./video.store";
import { computed, when } from "mobx";
import { Video_Screen } from "./video.store";

@StoreDecorator([VideoStore])
export default class PortStore extends BaseStore<null, [VideoStore]> {
  readonly name = "portStore";
  private videoStore: VideoStore;
  private playPromise: Promise<void>;

  get video() {
    return this.videoStore.video;
  }

  protected onInit() {
    this.videoStore = this.store.videoStore;
  }

  seek(time: number, play = false) {
    this.video.currentTime = Math.floor(time);
    if (play && this.videoStore.state.paused) {
      this.play();
    }
  }

  play() {
    if (this.videoStore.state.isMetadata) {
      return this.videoStore.video.play();
    } else {
      if (!this.playPromise) {
        this.playPromise = when(() => this.videoStore.state.isMetadata).then(
          () => this.videoStore.video?.play()
        );
      }
      return this.playPromise;
    }
  }

  pause() {
    this.videoStore.video?.pause();
  }

  fullScreen() {
    this.videoStore.setState({
      screen: Video_Screen.full,
    });
    this.rootPlayer.nodes.primary.requestFullscreen();
  }

  @computed
  get isFull() {
    return this.videoStore.state.screen === Video_Screen.full;
  }

  exitFullScreen() {
    this.videoStore.setState({
      screen: Video_Screen.normal,
    });
    document.exitFullscreen();
  }

  protected onReload() {
    this.playPromise = null;
  }

  protected onDestory() {
    this.playPromise = null;
  }
}
