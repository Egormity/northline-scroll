import { describe, expect, it } from 'vitest';
import { beatOpacity, sceneProgress, videoFrame, videoTime } from './math';

describe('authored scroll timeline', () => {
  it('clamps to the scene and handles a missing scroll range', () => {
    expect(sceneProgress(0, 100, 400)).toBe(0);
    expect(sceneProgress(300, 100, 400)).toBe(0.5);
    expect(sceneProgress(900, 100, 400)).toBe(1);
    expect(sceneProgress(100, 100, 0)).toBe(0);
  });
  it('visits every source frame and keeps the last seek inside its duration', () => {
    const frames = new Set(Array.from({ length: 4801 }, (_, i) => videoFrame(i / 4800, 240)));
    expect(frames.size).toBe(240);
    expect(videoFrame(-1, 240)).toBe(0);
    expect(videoFrame(2, 240)).toBe(239);
    expect(videoTime(239, 30, 8)).toBeLessThan(8);
    expect(videoTime(239, 30, 8)).toBeGreaterThan(239 / 30);
  });
  it('gives each beat a fully readable hold and preserves the opening and ending', () => {
    expect(beatOpacity(0, 0, 3)).toBe(1);
    for (let index = 0; index < 3; index++) expect(beatOpacity((index + 0.5) / 3, index, 3)).toBe(1);
    expect(beatOpacity(1, 2, 3)).toBe(1);
  });
});
