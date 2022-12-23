import { BaseConfigure } from "@/conf/setting.conf";
import { BaseStore, StoreDecorator } from "@/base/base.store";
import { RootPlayer } from "@/root.player";
import { observable, action, computed } from "mobx";

@StoreDecorator()
export class ConfigStore extends BaseStore {
  @observable.shallow
  primary: Partial<BaseConfigure>;

  constructor(rootPlayer: RootPlayer) {
    super(rootPlayer);
    this.parseConfig(rootPlayer.input);
  }

  @action
  private parseConfig(input: BaseConfigure) {
    this.primary = {
      videoSrc: input["videoSrc"],
    };
  }

  protected onReload() {
    super.onReload();
    this.parseConfig(this.rootPlayer.input);
  }
}
