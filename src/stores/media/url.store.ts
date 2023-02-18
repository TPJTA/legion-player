import { BaseStore, StoreDecorator } from "@/base/base.store";
import ConfigStore from "../common/config.store";
import VideoStore from "../common/video.store";

@StoreDecorator
export default class UrlStore extends BaseStore<null> {
  name = "urlStore";

  constructor(
    private videoStore: VideoStore,
    private configStore: ConfigStore
  ) {
    super();
    this.videoStore.replaceVideo(this.configStore.url);
  }
}
