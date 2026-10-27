export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const sceneProgress = (scroll: number, start: number, travel: number) =>
  travel > 0 ? clamp01((scroll - start) / travel) : 0;

export const videoFrame = (progress: number, frameCount: number) =>
  Math.round(clamp01(progress) * Math.max(0, frameCount - 1));

export const videoTime = (frame: number, fps: number, duration: number) =>
  Math.max(0, Math.min((frame + 0.25) / fps, duration - 0.001));

export const beatOpacity = (progress: number, index: number, count: number) => {
  const local = progress * count - index;
  const enter = index === 0 ? 1 : clamp01(local / 0.16);
  const exit = index === count - 1 ? 1 : clamp01((1 - local) / 0.16);
  return Math.min(enter, exit);
};
