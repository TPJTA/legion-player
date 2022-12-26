import { BaseStore } from "@/base/base.store";
import { Events } from "@/conf/index.conf";
import "@/styles/stores/video.less";

export const enum Video_Status {
  /** 未初始化完成 */
  Idle = 1,
  /** 可以开始播放 */
  Ready,
  /** 缓冲中 */
  Buff,
  /** 播放 */
  Play,
  /** 暂停 */
  Pause,
  /** 结束 */
  Ended,
  /** 错误 */
  Error,
}

const VideoDefaultState = {
  status: <Video_Status>1,
  /** 当前播放时间 */
  currentTime: 0,
  /** 视频总时长 */
  duration: 0,
  /** 最后缓冲时间 */
  bufferedTime: 0,
  /** canplay */
  canplay: false,
  /** rate */
  rate: 1,
  /** volume */
  volume: 1,
  /** load metadata */
  isMetadata: false,
};

export class VideoStore extends BaseStore<typeof VideoDefaultState> {
  readonly name = "videoStore";
  area: HTMLElement;
  video: HTMLVideoElement;

  get defaultState() {
    return VideoDefaultState;
  }

  onInit() {
    this.preloadDOM();
    this.addMeidiaEvents();
  }

  replaceVideo() {
    this.removeMeidiaEvents();
    this.area.removeChild(this.video);

    this.video = document.createElement("video");
    this.video.classList.add(`${this.ppx}-video`);
    this.area.appendChild(this.video);
    this.addMeidiaEvents();
  }

  private preloadDOM() {
    const ppx = this.ppx;
    this.area = document.createElement("div");
    this.area.classList.add(`${ppx}-video-warp`);
    this.area.innerHTML = `<video class="${ppx}-video"></video>`;
    this.video = this.area.querySelector("video");
    this.rootPlayer.nodes.primary.appendChild(this.area);
  }

  private addMeidiaEvents() {
    this.video.addEventListener("canplay", this.onCanplay);
    this.video.addEventListener("durationchange", this.onDurationchange);
    this.video.addEventListener("ended", this.onEnded);
    this.video.addEventListener("error", this.onError);
    this.video.addEventListener("loadeddata", this.onLoadeddata);
    this.video.addEventListener("loadstart", this.onLoadstart);
    this.video.addEventListener("loadedmetadata", this.onLoadedmetadata);
    this.video.addEventListener("pause", this.onPause);
    this.video.addEventListener("play", this.onPlay);
    this.video.addEventListener("playing", this.onPlaying);
    this.video.addEventListener("progress", this.onProgress);
    this.video.addEventListener("ratechange", this.onRatechange);
    this.video.addEventListener("seeked", this.onSeeked);
    this.video.addEventListener("seeking", this.onSeeking);
    this.video.addEventListener("timeupdate", this.onTimeupdate);
    this.video.addEventListener("volumechange", this.onVolumechange);
    this.video.addEventListener("waiting", this.onWaiting);
  }

  private removeMeidiaEvents() {
    this.video.removeEventListener("canplay", this.onCanplay);
    this.video.removeEventListener("durationchange", this.onDurationchange);
    this.video.removeEventListener("ended", this.onEnded);
    this.video.removeEventListener("error", this.onError);
    this.video.removeEventListener("loadeddata", this.onLoadeddata);
    this.video.removeEventListener("loadstart", this.onLoadstart);
    this.video.removeEventListener("loadedmetadata", this.onLoadedmetadata);
    this.video.removeEventListener("pause", this.onPause);
    this.video.removeEventListener("play", this.onPlay);
    this.video.removeEventListener("playing", this.onPlaying);
    this.video.removeEventListener("progress", this.onProgress);
    this.video.removeEventListener("ratechange", this.onRatechange);
    this.video.removeEventListener("seeked", this.onSeeked);
    this.video.removeEventListener("seeking", this.onSeeking);
    this.video.removeEventListener("timeupdate", this.onTimeupdate);
    this.video.removeEventListener("volumechange", this.onVolumechange);
    this.video.removeEventListener("waiting", this.onWaiting);
  }

  private onCanplay = (...args) => {
    this.setState({
      status: Video_Status.Ready,
    });
    this.rootPlayer.emit(Events.Player_canplay, ...args);
  };

  private onDurationchange = (...args) => {
    this.setState({
      duration: this.video.duration,
    });
    this.rootPlayer.emit(Events.Player_durationchange, ...args);
  };

  private onEnded = (...args) => {
    this.setState({
      status: Video_Status.Ended,
    });
    this.rootPlayer.emit(Events.Player_ended, ...args);
  };

  private onError = (...args) => {
    this.setState({
      status: Video_Status.Error,
    });
    this.rootPlayer.emit(Events.Player_error, ...args);
  };

  private onLoadeddata = (...args) => {
    this.rootPlayer.emit(Events.Player_loadeddata, ...args);
  };

  private onLoadstart = (...args) => {
    this.rootPlayer.emit(Events.Player_loadstart, ...args);
  };

  private onLoadedmetadata = (...args) => {
    this.setState({
      status: Video_Status.Ready,
      isMetadata: true,
    });
    this.rootPlayer.emit(Events.Player_loadedmetadata, ...args);
  };

  private onPause = (...args) => {
    this.setState({
      status: Video_Status.Pause,
    });
    this.rootPlayer.emit(Events.Player_pause, ...args);
  };

  private onPlay = (...args) => {
    this.setState({
      status: Video_Status.Play,
    });
    this.rootPlayer.emit(Events.Player_play, ...args);
  };

  private onPlaying = (...args) => {
    this.setState({
      status: Video_Status.Play,
    });
    this.rootPlayer.emit(Events.Player_playing, ...args);
  };

  private onProgress = (...args) => {
    const timeRange = this.video.buffered;
    if (timeRange.length > 0) {
      this.setState({
        bufferedTime: timeRange.end(timeRange.length - 1),
      });
      this.rootPlayer.emit(Events.Player_progress, ...args);
    }
  };

  private onRatechange = (...args) => {
    this.setState({
      rate: this.video.playbackRate,
    });
    this.rootPlayer.emit(Events.Player_ratechange, ...args);
  };

  private onSeeked = (...args) => {
    this.rootPlayer.emit(Events.Player_seeked, ...args);
  };

  private onSeeking = (...args) => {
    this.rootPlayer.emit(Events.Player_seeking, ...args);
  };

  private onTimeupdate = (...args) => {
    this.setState({
      currentTime: this.video.currentTime,
    });
    this.rootPlayer.emit(Events.Player_timeupdate, ...args);
  };

  private onVolumechange = (...args) => {
    this.setState({
      volume: this.video.volume,
    });
    this.rootPlayer.emit(Events.Player_volumechange, ...args);
  };

  private onWaiting = (...args) => {
    this.setState({
      status: Video_Status.Buff,
    });
    this.rootPlayer.emit(Events.Player_waiting, ...args);
  };
}
