import { useState, useEffect, useRef, useCallback } from "react";

type VideoPlayerProps = {
  src: string;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
};

type VideoPlayerState = {
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  isEnded: boolean;
};

const useVideoPlayer = (props: VideoPlayerProps) => {
  const { src, autoplay = false, controls = false, loop = false } = props;

  const [videoState, setVideoState] = useState<VideoPlayerState>({
    duration: 0,
    currentTime: 0,
    isPlaying: false,
    isEnded: false,
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const { duration, currentTime } = videoRef.current;
      const isEnded = currentTime === duration;
      setVideoState({
        duration,
        currentTime,
        isPlaying: !videoRef.current.paused,
        isEnded,
      });
    }
  }, []);

  const handlePlay = useCallback(() => {
    setVideoState((prevVideoState) => ({
      ...prevVideoState,
      isPlaying: true,
    }));
  }, []);

  const handlePause = useCallback(() => {
    setVideoState((prevVideoState) => ({
      ...prevVideoState,
      isPlaying: false,
    }));
  }, []);

  const handleEnded = useCallback(() => {
    setVideoState((prevVideoState) => ({
      ...prevVideoState,
      isPlaying: false,
      isEnded: true,
    }));
  }, []);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.addEventListener("timeupdate", handleTimeUpdate);
      videoEl.addEventListener("play", handlePlay);
      videoEl.addEventListener("pause", handlePause);
      videoEl.addEventListener("ended", handleEnded);

      if (autoplay) {
        videoEl.play();
      }
    }
    return () => {
      if (videoEl) {
        videoEl.removeEventListener("timeupdate", handleTimeUpdate);
        videoEl.removeEventListener("play", handlePlay);
        videoEl.removeEventListener("pause", handlePause);
        videoEl.removeEventListener("ended", handleEnded);
      }
    };
  }, [autoplay, handleTimeUpdate, handlePlay, handlePause, handleEnded]);

  const play = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  const pause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, []);

  return {
    videoRef,
    videoState,
    play,
    pause,
    seek,
    togglePlay,
    controls,
    loop,
    src,
  };
};

export default useVideoPlayer;
