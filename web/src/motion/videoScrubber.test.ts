import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createVideoScrubber, validManifest } from './videoScrubber';

class FakeVideo extends EventTarget {
  duration = 8;
  readyState = 2;
  seeking = false;
  error: { code: number } | null = null;
  dataset: Record<string, string> = {};
  requests: number[] = [];
  pause = vi.fn();
  private time = 0;
  get currentTime() {
    return this.time;
  }
  set currentTime(value: number) {
    this.time = value;
    this.requests.push(value);
    this.seeking = true;
  }
  finishSeek() {
    this.seeking = false;
    this.dispatchEvent(new Event('seeked'));
  }
}

describe('video target scheduling', () => {
  let callbacks: Map<number, FrameRequestCallback>;
  let nextId: number;
  const advance = () => {
    const waiting = [...callbacks.values()];
    callbacks.clear();
    waiting.forEach((callback) => callback(0));
  };
  beforeEach(() => {
    callbacks = new Map();
    nextId = 0;
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callbacks.set(++nextId, callback);
      return nextId;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => callbacks.delete(id));
  });
  afterEach(() => vi.unstubAllGlobals());

  it('coalesces pending targets and seeks directly to the latest requested frame', () => {
    const video = new FakeVideo();
    const ready = vi.fn();
    const controller = createVideoScrubber(
      video as unknown as HTMLVideoElement,
      { fps: 30, frameCount: 240, duration: 8 },
      ready,
      vi.fn(),
    );
    advance();
    expect(video.requests).toHaveLength(1);
    controller.setProgress(0.2);
    controller.setProgress(0.6);
    advance();
    expect(video.requests).toHaveLength(1);
    video.finishSeek();
    advance();
    expect(video.requests).toHaveLength(2);
    expect(video.currentTime).toBeCloseTo((143 + 0.25) / 30);
    video.finishSeek();
    advance();
    controller.setProgress(0.6);
    advance();
    expect(video.requests).toHaveLength(2);
    expect(ready).toHaveBeenCalledTimes(1);
    controller.destroy();
  });

  it('waits for valid metadata and cancels work and event listeners on disposal', () => {
    const video = new FakeVideo();
    video.readyState = 0;
    video.duration = NaN;
    const controller = createVideoScrubber(
      video as unknown as HTMLVideoElement,
      { fps: 30, frameCount: 240, duration: 8 },
      vi.fn(),
      vi.fn(),
    );
    controller.setProgress(1);
    advance();
    expect(video.requests).toHaveLength(0);
    video.duration = 8;
    video.readyState = 1;
    video.dispatchEvent(new Event('loadedmetadata'));
    advance();
    expect(video.currentTime).toBeLessThan(8);
    controller.setProgress(0.4);
    controller.destroy();
    video.finishSeek();
    advance();
    expect(video.requests).toHaveLength(1);
  });

  it('reports a media failure that happened before listeners attached', () => {
    const video = new FakeVideo();
    video.error = { code: 4 };
    const failed = vi.fn();
    const controller = createVideoScrubber(
      video as unknown as HTMLVideoElement,
      { fps: 30, frameCount: 240, duration: 8 },
      vi.fn(),
      failed,
    );
    expect(failed).toHaveBeenCalledTimes(1);
    expect(video.requests).toHaveLength(0);
    controller.destroy();
  });

  it('rejects invalid frame timing metadata', () => {
    expect(validManifest({ fps: NaN, frameCount: 300, duration: 10 })).toBe(false);
    expect(validManifest({ fps: 30, frameCount: 0, duration: 10 })).toBe(false);
    expect(validManifest({ fps: 30000 / 1001, frameCount: 300, duration: 10.01 })).toBe(true);
  });
});
