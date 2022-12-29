import { RootPlayer } from "./root.player";
declare global {
  interface Window {
    legion: typeof RootPlayer;
  }
}

window.legion = RootPlayer;
