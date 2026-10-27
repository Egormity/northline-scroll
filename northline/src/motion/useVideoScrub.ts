import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { createVideoScrubber, validManifest, type VideoManifest } from './videoScrubber';

export const useVideoScrub = (ref: RefObject<HTMLVideoElement | null>, enabled: boolean) => {
  const [manifest, setManifest] = useState<VideoManifest | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const progress = useRef(0);
  const scrubber = useRef<ReturnType<typeof createVideoScrubber> | null>(null);

  useEffect(() => {
    if (!enabled) {
      setReady(false);
      return;
    }
    const abort = new AbortController();
    setFailed(false);
    fetch(`${import.meta.env.BASE_URL}media/journey.json`, { signal: abort.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Film information unavailable');
        const value: unknown = await response.json();
        if (!validManifest(value)) throw new Error('Invalid film information');
        if (!abort.signal.aborted) setManifest(value);
      })
      .catch(() => {
        if (!abort.signal.aborted) setFailed(true);
      });
    return () => abort.abort();
  }, [enabled, attempt]);

  useEffect(() => {
    const video = ref.current;
    if (!enabled || !manifest || !video) return;
    const instance = createVideoScrubber(
      video,
      manifest,
      () => setReady(true),
      () => {
        setReady(false);
        setFailed(true);
      },
    );
    scrubber.current = instance;
    instance.setProgress(progress.current);
    return () => {
      instance.destroy();
      scrubber.current = null;
    };
  }, [enabled, manifest, ref, attempt]);

  const setProgress = useCallback((value: number) => {
    progress.current = value;
    scrubber.current?.setProgress(value);
  }, []);
  const retry = useCallback(() => {
    setReady(false);
    setFailed(false);
    setAttempt((value) => value + 1);
    ref.current?.load();
  }, [ref]);
  return { setProgress, ready, failed, retry };
};
