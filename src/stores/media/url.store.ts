import { BaseStore, StoreDecorator } from "@/base/base.store";
import { ConfigStore } from "../common/config.store";
import { VideoStore } from "../common/video.store";

@StoreDecorator([ConfigStore, VideoStore])
export class UrlStore extends BaseStore<null, [ConfigStore, VideoStore]> {
  name = "urlStore";

  onInit() {
    this.store.videoStore.video.src = this.store.configStore.url;
  }
}
