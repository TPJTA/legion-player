export const commonPlugin = [
  () => import("@/plugins/ctrl/progress.ctrl"),
  () => import("@/plugins/ctrl/play.ctrl"),
  () => import("@/plugins/ctrl/time.ctrl"),
  () => import("@/plugins/ctrl/full.ctrl"),
];
