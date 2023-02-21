import { DocumentData } from "firebase/firestore";
import React, {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

interface VideoElementProps {
  post: DocumentData & { id: string };
  rootref: RefObject<HTMLDivElement>;
  isActive: boolean;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

const VideoElement: React.FC<VideoElementProps> = ({
  post,
  rootref,
  isActive,
  setActiveTab,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const playVideo = () => {
    console.log("PlayVideo called--", post.id);
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
    }
  };

  const pauseVideo = () => {
    console.log("Pause video called--", post.id);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.muted = true;
    }
  };

  const reference = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const cleanOb = () => {
    if (observer.current) {
      console.log("observer disconnected", post.id);
      observer.current.disconnect();
    }
  };
  useEffect(() => {
    if (!reference) return;
    cleanOb();
    const ob = (observer.current = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        if (isElementIntersecting) {
          setActiveTab(post.id);
          playVideo();
        }
      },
      {
        threshold: 1.0,
        root: rootref.current,
      }
    ));

    if (reference.current) ob.observe(reference.current);
    return () => {
      cleanOb();
    };
  }, [reference]);


  const handleClick = () => {
    if (!isActive) return;
    console.log("handleClick called", post.id);
    if (isPlaying) {
      pauseVideo();
      console.log("paused");
      setIsPlaying(false);
    } else {
      playVideo();
      console.log("played");
      setIsPlaying(true);
    }
  };

  return (
    <div ref={reference} className="h-full flex justify-center">
      <div onClick={handleClick} className="">
        {isActive ? (
          <video
            src={post.PostUrl}
            ref={videoRef}
            controlsList="nodownLoad"
            loop
            autoPlay
            className="h-full w-[335px] pointer-events-none object-cover object-center border border-gray-200 rounded-lg dark:border-gray-700"
          />
        ) : (
          <img src="/assets/bg1.jpg" alt="thumbnail" />
        )}
      </div>
    </div>
  );
};

export default VideoElement;
