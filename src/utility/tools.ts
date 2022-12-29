export function formatSeconds(seconds = 0): string {
  const sec = Math.floor(seconds) >> 0;
  let ret = ("0" + (sec % 60)).slice(-2);
  ret = Math.floor((sec % 3600) / 60) + ":" + ret;

  if (ret.length < 5) {
    ret = "0" + ret;
  }

  const hourFormat = !!Math.floor(seconds / 3600);
  if (hourFormat) {
    ret = Math.floor(seconds / 3600) + ":" + ret;
  }

  return ret;
}
