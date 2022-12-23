import type { BaseStore } from "@/base/base.store";

export interface BaseConfigure {
  videoSrc: string;
}

export interface Configure extends BaseConfigure {
  element: HTMLElement;
  store?: typeof BaseStore[];
}
