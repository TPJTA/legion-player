import ConfigStore from "@/stores/common/config.store";
import PluginStore from "@/stores/common/plugin.store";
import PortStore from "@/stores/common/port.store";
import VideoStore from "@/stores/common/video.store";
import UrlStore from "@/stores/media/url.store";

export const commonStores = [
  ConfigStore,
  VideoStore,
  UrlStore,
  PluginStore,
  PortStore,
];
