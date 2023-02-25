import { db } from "@/firebase/store";
import useVideoPlayer from "@/hooks/useVideoPlayerDev";
import {
  ArrowDownTrayIcon,
  ChatBubbleBottomCenterTextIcon,
  EllipsisHorizontalCircleIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  HeartIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";
import { error } from "console";
import { User } from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  doc,
  DocumentData,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import { saveAs } from "file-saver";
import React, {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

interface VideoElementProps {
  post: DocumentData & { id: string };
  rootref: RefObject<HTMLDivElement>;
  isActive: boolean;
  setActiveTab: Dispatch<SetStateAction<string>>;
  observer: MutableRefObject<IntersectionObserver | null>;
  user: User;
}

const VideoElement: React.FC<VideoElementProps> = ({
  post,
  rootref,
  isActive,
  setActiveTab,
  observer: rootObserver,
  user,
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
  const [liked, setLiked] = useState<boolean>(() => {
    if (post.likes.includes(user.uid)) return true;
    return false;
  });
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

  const handleLike = async () => {
    if (!isActive) return;
    console.log("handleLike called", post.id);
    //animate
    if (!liked) {
      try {
        const postId = post.id;
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid),
        });
        setLiked(true);
      } catch (error) {
        console.log("like Error", error);
        toast.error("whoops! something went wrong");
      }
    }
  };
  const handleDislike = async () => {
    if (!isActive) return;
    console.log("handleDislike called", post.id);
    //animate
    if (liked) {
      try {
        const postId = post.id;
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid),
        });
        setLiked(false);
      } catch (error) {
        console.log("like Error", error);
        toast.error("whoops! something went wrong");
      }
    }
  };
  const handleDownload = async () => {
    if (!isActive) return;
    console.log("handleDownload called", post.id);
    // This can be downloaded directly:
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      const blob = xhr.response;
    };
    xhr.open('GET', post.postVideoUrl);
    xhr.send();
  };
  return (
    <div ref={reference} className="h-full flex justify-center space-x-1">
      <div
        onClick={handleClick}
        className="video-wrapper relative flex justify-center items-center overflow-hidden h-full w-[335px]  dark:bg-gray-600 bg-slate-50 rounded-xl bg-center bg-cover bg-no-repeat"
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
        <div className="opacity-0 hover:opacity-100 absolute z-20 bg-gradient-to-t bg-opacity-5 from-gray-900 via-transparent to-transparent w-full h-full">
          {!isPlaying ? (
            <PlayIcon
              className=" absolute top-2 left-2 w-6 h-6 text-white cursor-pointer"
              // onClick={togglePlay}
            />
          ) : (
            <PauseIcon
              className="w-6 h-6 absolute top-2 left-2 text-white cursor-pointer"
              // onClick={togglePlay}
            />
          )}
          <div className="sm:hidden  absolute right-0 top-1/2 transform-cpu -translate-y-1/2 flex flex-col justify-end p-3 space-y-8 rounded-md ">
        <HeartIcon
          onClick={handleLike}
          className={`videoplayer_element_onscreen ${liked && "text-[#FF0084] dark:text-[#FF0084]"}`}
        />
        <HandThumbDownIcon
          onClick={handleDislike}
          className={`videoplayer_element_onscreen ${
            !liked && "text-gray-900 bg-white bg-opacity-25 backdrop-blur-md"
          }`}
        />
        
        <ChatBubbleBottomCenterTextIcon className=" videoplayer_element_onscreen" />
        <EllipsisHorizontalCircleIcon className="videoplayer_element_onscreen " />
        {isMuted ? (
          <SpeakerXMarkIcon
            className=" videoplayer_element_onscreen "
            onClick={toggleMute}
          />
        ) : (
          <SpeakerWaveIcon
            className=" videoplayer_element_onscreen text-white h-10 w-10 bg-gray-900 bg-opacity-10 backdrop-blur-md p-2 rounded-full"
            onClick={toggleMute}
          />
        )}
      </div>
          <div className="absolute flex flex-col bottom-0 w-full ">
            <p className="text-base font-normal text-gray-100 px-4 py-1 truncate">
              {post.postTitle}
            </p>
            <div className="flex justify-between px-4 pb-2">
              <div className="flex items-center">
                <div className="relative w-9 h-9 rounded-full ">
                  <Image
                    fill
                    src={post.user_profile_pic_url}
                    className="object-cover object-center"
                    alt={"😍"}
                  />
                </div>
                <p className="text-gray-100 text-sm">@{post.username}</p>
              </div>
              <div className="flex items-center">
                <button
                type="button"
                className="px-2 py-1 rounded-md font-semibold text-gray-100 bg-red-500"
              >
                ➕Feed
              </button>
              </div>
              
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700">
              <div
                className="bg-red-600 h-1 rounded-full dark:bg-red-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden sm:flex flex-col justify-end p-3 space-y-8 rounded-md ">
        <HeartIcon
          onClick={handleLike}
          className={`videoplayer_element ${liked && "text-[#FF0084] dark:text-[#FF0084]"}`}
        />
        <HandThumbDownIcon
          onClick={handleDislike}
          className={`videoplayer_element ${
            !liked && "text-white bg-gray-500"
          }`}
        />
        
        <ChatBubbleBottomCenterTextIcon className=" videoplayer_element" />
        <ArrowDownTrayIcon
          // onClick={handleDownload}
          className="  videoplayer_element cursor-not-allowed"
        />
        <EllipsisHorizontalCircleIcon className="videoplayer_element " />
        {isMuted ? (
          <SpeakerXMarkIcon
            className=" videoplayer_element"
            onClick={toggleMute}
          />
        ) : (
          <SpeakerWaveIcon
            className=" videoplayer_element"
            onClick={toggleMute}
          />
        )}
      </div>
    </div>
  );
};

export default VideoElement;
