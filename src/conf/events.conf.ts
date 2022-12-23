export const enum Events {
  /** 播放器初始化完成 */
  Player_Init = "player_init",

  /** 播放器store初始化完成 */
  Player_Store_Init = "player_store_init",

  /** 播放器view初始化完成 */
  Player_View_Init = "player_view_init",

  /** 播放器重载 */
  Player_Reload = "player_reload",

  /** 播放器销毁 */
  Player_Destory = "player_destory",

  // media event
  Player_canplay = "player_canplay",
  Player_durationchange = "player_durationchange",
  Player_ended = "player_ended",
  Player_error = "player_error",
  Player_loadeddata = "player_loadeddata",
  Player_loadstart = "player_loadstart",
  Player_loadedmetadata = "player_loadedmetadata",
  Player_pause = "player_pause",
  Player_play = "player_play",
  Player_playing = "player_playing",
  Player_progress = "player_progress",
  Player_ratechange = "player_ratechange",
  Player_seeked = "player_seeked",
  Player_seeking = "player_seeking",
  Player_timeupdate = "Player_timeupdate",
  Player_volumechange = "player_volumechange",
  Player_waiting = "player_waiting",
}
