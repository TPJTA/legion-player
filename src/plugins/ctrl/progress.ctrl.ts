import { BasePlugin, PluginDecorator } from "@/base/base.plugin";
import CtrlStore from "@/stores/common/ctrl.store";
import VideoStore from "@/stores/common/video.store";

@PluginDecorator([VideoStore, CtrlStore])
export default class ProgressPlugin extends BasePlugin<
  [VideoStore, CtrlStore]
> {
  onInit() {
    console.log(this.store);
  }
}
