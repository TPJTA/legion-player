import { ConfigStore } from "@/stores/common/config.store";
import { CtrlStore } from "@/stores/common/ctrl.store";
import { PluginStore } from "@/stores/common/plugin.store";
import { VideoStore } from "@/stores/common/video.store";
import { UrlStore } from "@/stores/media/url.store";

export const commonStores = [ConfigStore, VideoStore, UrlStore, PluginStore];
