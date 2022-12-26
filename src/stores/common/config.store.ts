import { Configure } from "@/conf/setting.conf";
import { BaseStore, StoreDecorator } from "@/base/base.store";
import { observable, action, computed } from "mobx";
import { BasePluginConstructor } from "@/base/base.plugin";

@StoreDecorator()
export class ConfigStore extends BaseStore {
  readonly name = "configStore";
  @observable.shallow
  primary: Partial<Configure>;

  onInit() {
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
