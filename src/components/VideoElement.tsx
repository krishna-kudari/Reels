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
} from "@heroicons/react/24/outline";
import { error } from "console";
import { User } from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
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
import { uuidv4 } from "@firebase/util";
import toast from "react-hot-toast";
import CommentBox from "./CommentBox";
import Link from "next/link";

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
  const commentBoxRef = useRef<HTMLDivElement | null>(null);
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
  const [IsFollowLoading, setIsFollowLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followDoc, setFollowDoc] = useState<DocumentData | null>(null);
  const [commentBoxOpen, setCommentBoxOpen] = useState(false);

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
        } else {
          setIsFollowLoading(false);
          setCommentBoxOpen(false);
        }
      },
      {
        threshold: 1.0,
        root: rootref.current,
      }
    ));

    if (reference.current) ob.observe(reference.current);
    return () => {
      setCommentBoxOpen(false);
      cleanOb();
    };
  }, [reference]);

  useEffect(() => {
    const handleClickOutside = (event:any) => {
      
      if(commentBoxRef.current && !commentBoxRef.current.contains(event.target)){
        // event.preventDefault();
        setCommentBoxOpen(false);
      }
    }
    window.addEventListener("mousedown",handleClickOutside);
    return () => {
      window.removeEventListener("mousedown",handleClickOutside);
    }
  }, [commentBoxRef])
  
  useEffect(() => {
    const setFollowing = async () => {
      const q = query(
        collection(db, "follows"),
        where("follower", "==", user.uid),
        where("following", "==", post.userId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length) {
        setIsFollowing(true);
        setFollowDoc(querySnapshot.docs[0]);
      }
    };
    setFollowing();
  }, [IsFollowLoading, isActive]);

  const handleClick = () => {
    if (!isActive) return;
    console.log("handleClick called", post.id);
    togglePlay();
  };

  const handleLike = async (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (!isActive) return;
    console.log("handleLike called", post.id);
    //animate
    if (!liked) {
      try {
        setLiked(true);
        const postId = post.id;
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid),
        });
      } catch (error) {
        setLiked(false);
        console.log("like Error", error);
        toast.error("whoops! something went wrong");
      }
    }
  };
  const handleDislike = async (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (!isActive) return;
    console.log("handleDislike called", post.id);
    //animate
    if (liked) {
      try {
        setLiked(false);
        const postId = post.id;
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid),
        });
      } catch (error) {
        setLiked(true);
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
    xhr.responseType = "blob";
    xhr.onload = (event) => {
      const blob = xhr.response;
    };
    xhr.open("GET", post.postVideoUrl);
    xhr.send();
  };
  const handleFollow = async (e: React.SyntheticEvent) => {
    e.stopPropagation();
    console.log("follow");
    const followId = uuidv4();
    const followDoc = {
      id: followId,
      follower: user.uid,
      following: post.userId,
      createdAt: serverTimestamp(),
    };
    setIsFollowLoading(true);
    try {
      setIsFollowing(true);
      await setDoc(doc(db, "follows", followId), followDoc);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFollowLoading(false);
    }
  };
  const handleUnfollow = async (e: React.SyntheticEvent) => {
    e.stopPropagation();
    console.log("unfollow");
    if (followDoc == null) return;
    setIsFollowLoading(true);
    try {
      await deleteDoc(doc(db, "follows", followDoc.id));
      setIsFollowing(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFollowLoading(false);
    }
  };
  return (
    <div ref={reference} className="h-full flex justify-center space-x-1">
      <div
        className="video-wrapper relative flex justify-center items-center overflow-hidden h-full w-[335px]  dark:bg-systemGrayDark-300 bg-slate-50 rounded-xl bg-center bg-cover bg-no-repeat"
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
        <div
          onClick={handleClick}
          className="sm:opacity-0 sm:hover:opacity-100 opacity-100 absolute z-20 bg-gradient-to-t bg-opacity-5 from-gray-900 via-transparent to-transparent w-full h-full"
        >
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
              className={`cursor-pointer videoplayer_element_onscreen ${
                liked && "text-[#FF0084] dark:text-[#FF0084]"
              }`}
            />
            <HandThumbDownIcon
              onClick={handleDislike}
              className={` cursor-pointer videoplayer_element_onscreen ${
                !liked &&
                "text-gray-900 bg-white bg-opacity-25 backdrop-blur-md"
              }`}
            />

            <ChatBubbleBottomCenterTextIcon
              onClick={(e) => {
                e.stopPropagation();
                setCommentBoxOpen(!commentBoxOpen);
                console.log("commentSVGClick");
              }}
              className="cursor-pointer videoplayer_element_onscreen"
            />
            {/* <EllipsisHorizontalCircleIcon className="videoplayer_element_onscreen " /> */}
            {isMuted ? (
              <SpeakerXMarkIcon
                className=" videoplayer_element_onscreen cursor-pointer "
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
              />
            ) : (
              <SpeakerWaveIcon
                className="cursor-pointer videoplayer_element_onscreen text-white h-10 w-10 bg-gray-900 bg-opacity-10 backdrop-blur-md p-2 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
              />
            )}
          </div>
          <div className="absolute flex flex-col bottom-0 w-full ">
            <p className="text-base font-normal text-gray-100 px-4 py-1 truncate">
              {post.postTitle}
            </p>
            <div className="flex justify-between px-4 pb-2">
              <Link href={`/${post.username}?profileId=${post.userId}`}>
                <div className="flex items-center space-x-1">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden">
                    <Image
                      fill
                      src={post.user_profile_pic_url}
                      className="object-cover object-center"
                      alt={"😍"}
                    />
                  </div>
                  <p className="text-gray-100 text-sm">@{post.username}</p>
                </div>
              </Link>
              <div className="flex items-center">
                {!isFollowing ? (
                  <button
                    type="button"
                    disabled={IsFollowLoading}
                    hidden={post.userId == user.uid}
                    onClick={handleFollow}
                    className="cursor-pointer px-3 py-1 rounded-full font-semibold text-gray-100 bg-systemGrayDark-400"
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={IsFollowLoading}
                    hidden={post.userId == user.uid}
                    onClick={handleUnfollow}
                    className="cursor-pointer px-2 py-1 rounded-full font-semibold text-systemLbLight-400 bg-systemGrayLight-200"
                  >
                    Unfollow
                  </button>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-[2px] dark:bg-gray-700">
              <div
                className="bg-red-600 h-[2px] rounded-full dark:bg-red-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden sm:flex flex-col justify-end p-3 space-y-8 rounded-md ">
        <HeartIcon
          onClick={handleLike}
          className={`videoplayer_element ${
            liked && "text-[#FF0084] dark:text-[#FF0084]"
          }`}
        />
        <HandThumbDownIcon
          onClick={handleDislike}
          className={`videoplayer_element ${
            !liked && "text-white bg-gray-500"
          }`}
        />

        <ChatBubbleBottomCenterTextIcon
          onClick={() => setCommentBoxOpen(!commentBoxOpen)}
          className=" videoplayer_element"
        />
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

      {commentBoxOpen && (
        <div ref={commentBoxRef} className="sm:flex  sm:h-full sm:static sm:z-10 z-30 absolute top-1/2 left-0 right-0 h-[50vh]">
          <CommentBox post={post} currentUser={user} />
        </div>
      )}
    </div>
  );
};

export default VideoElement;
