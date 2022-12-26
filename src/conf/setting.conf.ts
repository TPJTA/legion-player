import {
  BasePluginConstructor,
  lazyBasePluginConstructor,
} from "@/base/base.plugin";

export interface Configure {
  element: HTMLElement;
  videoSrc: string;
  plugins?: Array<BasePluginConstructor | lazyBasePluginConstructor>;
}
