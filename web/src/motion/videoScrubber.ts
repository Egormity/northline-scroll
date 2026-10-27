import { videoFrame, videoTime } from './math';

export interface VideoManifest {
  fps: number;
  frameCount: number;
  duration: number;
}

export const validManifest = (value: unknown): value is VideoManifest => {
  if (!value || typeof value !== 'object') return false;
  const item = value as VideoManifest;
  return (
    Number.isFinite(item.fps) &&
    item.fps > 0 &&
    item.fps <= 120 &&
    Number.isInteger(item.frameCount) &&
    item.frameCount > 1 &&
    item.frameCount <= 7200 &&
    Number.isFinite(item.duration) &&
    item.duration > 0 &&
    item.duration <= 60
  );
};

export const createVideoScrubber = (
  video: HTMLVideoElement,
  manifest: VideoManifest,
  onReady: () => void,
  onError: () => void,
) => {
  let desiredFrame = 0;
  let requestedFrame = -1;
  let pending = false;
  let frame = 0;
  let disposed = false;
  let startedAt = 0;
  let presentedCallback = 0;
  let presentedCount = 0;
  let readyNotified = false;

  const flush = () => {
    frame = 0;
    if (disposed) return;
    if (video.error) {
      onError();
      return;
    }
    if (
      pending ||
      video.seeking ||
      video.readyState < 1 ||
      !Number.isFinite(video.duration) ||
      video.duration <= 0
    )
      return;
    if (desiredFrame === requestedFrame) return;
    try {
      pending = true;
      requestedFrame = desiredFrame;
      startedAt = performance.now();
      video.currentTime = videoTime(desiredFrame, manifest.fps, video.duration);
      video.dataset.targetFrame = String(desiredFrame);
    } catch {
      pending = false;
      onError();
    }
  };
  const queue = () => {
    if (!disposed && !frame) frame = requestAnimationFrame(flush);
  };
  const ready = () => {
    if (video.error) {
      onError();
      return;
    }
    if (video.readyState >= 2 && !readyNotified) {
      readyNotified = true;
      onReady();
    }
    queue();
  };
  const seeked = () => {
    pending = false;
    video.dataset.seekMs = (performance.now() - startedAt).toFixed(1);
    ready();
  };
  const error = () => {
    pending = false;
    onError();
  };
  const presented = (_now: number, metadata: VideoFrameCallbackMetadata) => {
    if (disposed) return;
    presentedCount++;
    video.dataset.presentedFrames = String(presentedCount);
    video.dataset.presentedTime = metadata.mediaTime.toFixed(4);
    presentedCallback = video.requestVideoFrameCallback(presented);
  };
  video.pause();
  video.addEventListener('loadedmetadata', queue);
  video.addEventListener('loadeddata', ready);
  video.addEventListener('seeked', seeked);
  video.addEventListener('error', error);
  if ('requestVideoFrameCallback' in video)
    presentedCallback = video.requestVideoFrameCallback(presented);
  ready();
  return {
    setProgress(progress: number) {
      desiredFrame = videoFrame(progress, manifest.frameCount);
      queue();
    },
    destroy() {
      disposed = true;
      cancelAnimationFrame(frame);
      if (presentedCallback) video.cancelVideoFrameCallback(presentedCallback);
      video.removeEventListener('loadedmetadata', queue);
      video.removeEventListener('loadeddata', ready);
      video.removeEventListener('seeked', seeked);
      video.removeEventListener('error', error);
      video.pause();
    },
  };
};
