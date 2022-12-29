/** @file 封装video的各种api */
import { BaseStore, StoreDecorator } from "@/base/base.store";
import VideoStore from "./video.store";
import { when } from "mobx";

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

  protected onReload() {
    this.playPromise = null;
  }

  protected onDestory() {
    this.playPromise = null;
  }
}
