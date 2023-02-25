import useVideoPlayer from "@/hooks/useVideoPlayerDev";
import { ArrowDownTrayIcon, ChatBubbleBottomCenterTextIcon, EllipsisHorizontalCircleIcon, HandThumbDownIcon, HandThumbUpIcon, PauseIcon, PlayIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import { DocumentData } from "firebase/firestore";
import Image from "next/image";
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
  observer: MutableRefObject<IntersectionObserver | null>;
}

const VideoElement: React.FC<VideoElementProps> = ({
  post,
  rootref,
  isActive,
  setActiveTab,
  observer: rootObserver,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const {
    isPlaying,
    isMuted,
    togglePlay,
    toggleMute,
    handleOnTimeUpdate,
    progress,
  } = useVideoPlayer({ videoElement: videoRef });

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
          console.log("post intersecting", post);
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
    togglePlay();
  };

  return (
    <div ref={reference} className="h-full flex justify-center space-x-1">
      <div
        onClick={handleClick}
        className="video-wrapper relative flex justify-center items-center overflow-hidden h-full w-[335px] border dark:bg-gray-600 bg-slate-50 rounded-xl bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${post.postThumbnailUrl})` }}
      >
        {isActive ? (
          <video
            src={post.postVideoUrl}
            ref={videoRef}
            controlsList="nodownLoad"
            loop
            autoPlay
            //onEnded={onEnded}
            muted={isMuted}
            onTimeUpdate={() => {
              isActive && handleOnTimeUpdate();
            }}
            className="h-full w-[335px] pointer-events-none object-cover object-center border border-gray-200 rounded-lg dark:border-gray-700"
          />
        ) : (
          <img
            src={post.postThumbnailUrl}
            className="object-cover object-center w-full h-full"
            alt="thumbnail"
          />
        )}
        <div className="opacity-0 hover:opacity-100 absolute z-20 bg-gradient-to-t bg-opacity-5 from-gray-900 via-transparent to-black w-full h-full">
          {!isPlaying ? <PlayIcon className=" absolute top-2 left-2 w-8 h-8 text-white" onClick={togglePlay} /> : <PauseIcon className="w-8 h-8 absolute top-2 left-2 text-white" onClick={togglePlay} />}
          <div className="absolute flex flex-col bottom-0 w-full ">
            <p className="text-lg font-semibold text-gray-100 px-4 py-2">{post.postTitle}</p>
            <div className="flex justify-between px-4 py-2">
              <div className="inline-flex items-center">
                <div className="relative w-10 h-10 p-1 rounded-full ">
                  <Image fill src={post.user_profile_pic_url} className="object-cover object-center" alt={"😍"} />
                </div>
                <p className="text-gray-100">@{post.username}</p>
              </div>
              <button type="button" className="px-2 rounded-md font-semibold text-gray-900 bg-gray-300">subscribe</button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-end p-3 space-y-8 rounded-md ">
        <HandThumbUpIcon className=" videoplayer_element" />
        <HandThumbDownIcon className="videoplayer_element " />
        <ChatBubbleBottomCenterTextIcon className=" videoplayer_element" />
        <ArrowDownTrayIcon className="  videoplayer_element" />
        <EllipsisHorizontalCircleIcon className="videoplayer_element "/>
        {isMuted ? (
          <SpeakerXMarkIcon className=" videoplayer_element" onClick={toggleMute} />
        ) : (
          <SpeakerWaveIcon className=" videoplayer_element" onClick={toggleMute} />
        )}

      </div>
    </div>
  );
};

export default VideoElement;
