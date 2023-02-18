import { Configure } from "@/conf/setting.conf";
import { BaseStore, StoreDecorator } from "@/base/base.store";
import { observable, action, computed } from "mobx";

@StoreDecorator
export default class ConfigStore extends BaseStore {
  @observable.shallow
  primary: Partial<Configure>;

  constructor() {
    super();
    this.parseConfig(this.rootPlayer.input);
  }

  @action
  private parseConfig(input: Configure) {
    this.primary = {
      element: input["element"],
      videoSrc: input["videoSrc"],
      plugins: input["plugins"],
    };
  }

  @computed
  get plugins() {
    return this.primary.plugins ?? [];
  }

  @computed
  get url() {
    return this.primary.videoSrc;
  }

  protected onReload() {
    super.onReload();
    this.parseConfig(this.rootPlayer.input);
  }
}
