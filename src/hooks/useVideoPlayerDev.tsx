import { MutableRefObject, useEffect, useState } from "react";

type useVideoPlayerProps = {
  videoElement: MutableRefObject<HTMLVideoElement | null>;
};

const useVideoPlayer = ({ videoElement }: useVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    setIsPlaying((isPlaying)=>!isPlaying);
  };

  useEffect(() => {
    if(!videoElement.current)return;
    isPlaying ? videoElement.current?.play() : videoElement.current?.pause();
  }, [isPlaying, videoElement]);

  const handleOnTimeUpdate = () => {
    if(!videoElement.current)return;
    const progress = ((videoElement.current as HTMLVideoElement).currentTime / (videoElement.current as HTMLVideoElement).duration) * 100;
    setProgress(progress);
  }

  const handleVideoProgress = (event: React.SyntheticEvent) => {
    if(!videoElement.current)return;
    const manualChange = Number((event.target as HTMLInputElement).value);
    (videoElement.current as HTMLVideoElement).currentTime = ((videoElement.current as HTMLVideoElement).duration / 100 )* manualChange;
    setProgress(manualChange);
  }

  const handleVideoSpeed = (event: React.FormEvent<HTMLInputElement>) => {
    if(!videoElement.current)return;
    const speed = Number((event.target as HTMLInputElement).value);
    (videoElement.current as HTMLVideoElement).playbackRate = speed;
    setSpeed(speed);
  }

  const toggleMute = () => {
    setIsMuted((isMuted)=>!isMuted);
  }

  useEffect(()=>{
    if(!videoElement.current) return;
    isMuted ? ((videoElement.current as HTMLVideoElement).muted = true) : ((videoElement.current as HTMLVideoElement).muted = false);
  },[isMuted, videoElement]);

  return {
    isPlaying,isMuted,progress,speed,
    handleOnTimeUpdate,togglePlay,toggleMute,handleVideoProgress,handleVideoSpeed
  }
};

export default useVideoPlayer;
