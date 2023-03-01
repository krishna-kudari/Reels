import Loader from "@/components/Loader";
import { db } from "@/firebase/store";
import {
  arrayRemove,
  arrayUnion,
  doc,
  DocumentData,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { google_mark_colored, reels_mark_solid } from "public/assets";
import {
  ChatBubbleBottomCenterTextIcon,
  CheckBadgeIcon,
  EllipsisHorizontalCircleIcon,
  HandThumbDownIcon,
  HeartIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";
import PostsList from "@/components/PostsList";
import useVideoPlayer from "@/hooks/useVideoPlayerDev";
import { ArrowDownTrayIcon, HomeIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import CommentBox from "@/components/CommentBox";
import ThemeButton from "@/components/ThemeButton";
import Link from "next/link";
interface ProfileProps {}

const Profile: React.FC<ProfileProps> = ({}) => {
  const router = useRouter();
  const [profileData, setProfileData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<
    (DocumentData & { id: string }) | null
  >(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const modalContentRef = useRef<HTMLDivElement | null>(null);
  const { currentUser } = useAuth();
  const [liked, setLiked] = useState<boolean>(() => {
    if (selectedPost?.likes.includes(currentUser?.uid)) return true;
    return false;
  });
  const [CommentBoxOpen, setCommentBoxOpen] = useState(false);
  const {
    isPlaying,
    isMuted,
    togglePlay,
    toggleMute,
    handleOnTimeUpdate,
    progress,
  } = useVideoPlayer({ videoElement: videoRef });
  useEffect(() => {
    if (!router.isReady || !currentUser) return;
    setLoading(true);
    let { profileId } = router.query;
    console.log("profileId", profileId);
    if (!profileId) return;
    if (Array.isArray(profileId)) profileId = profileId[0];
    const getProfileData = async () => {
      try {
        const profileRef = doc(db, "users", profileId as string);
        const docSnap = await getDoc(profileRef);
        if (docSnap.exists()) {
          const profileData = docSnap.data();
          console.log("profileData", profileData);
          setProfileData(profileData);
        }
      } catch (error: any) {
        console.log("fetch Profile Error", error);
      } finally {
        setLoading(false);
      }
    };
    getProfileData();
  }, [router.isReady, currentUser]);

  // console.log(router.query.profileId);

  const onPostClick = (post: DocumentData & { id: string }) => {
    console.log("modal", post);
    setSelectedPost(post);
    setModalOpen(true);
  };

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target)
      ) {
        setModalOpen(false);
        setSelectedPost(null);
      }
    }

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalContentRef]);
  const handleLike = async () => {
    if (!selectedPost || !currentUser) return;
    console.log("handleLike called", selectedPost?.id);
    //animate
    if (!liked) {
      try {
        const postId = selectedPost?.id;
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid),
        });
        setLiked(true);
      } catch (error) {
        console.log("like Error", error);
        toast.error("whoops! something went wrong");
      }
    }
  };
  const handleDislike = async () => {
    if (!selectedPost || !currentUser) return;
    console.log("handleDislike called", selectedPost.id);
    //animate
    if (liked) {
      try {
        const postId = selectedPost.id;
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid),
        });
        setLiked(false);
      } catch (error) {
        console.log("like Error", error);
        toast.error("whoops! something went wrong");
      }
    }
  };
  return (
    <div className="bg-gray-100 px-2 min-h-screen">
      <div className="absolute top-0 w-screen  bg-transparent border-1 flex justify-between z-30">
        <div
          className={` max-w-sm w-1/2 md:w-[calc(50%-230px)] rounded-br-3xl shadow-sm p-2 px-4 space-x-2 justify-between bg-gray-200 bg-opacity-20 backdrop-blur-sm flex items-center`}
        >
          <div className="flex space-x-1  ">
            <div className="relative  h-8 w-8 ">
              <Image
                src={reels_mark_solid}
                fill
                className="object-cover"
                alt={"🎬🎞️"}
              />
            </div>
            <p className="hidden sm:block font-bold text-xl text-slate-900 ">
              reels
            </p>
          </div>
          <Link href={"/"}>
            <HomeIcon className="h-7 w-7 dark:text-slate-50  text-gray-900 hover:scale-90 transition-all duration-300 ease-in-out" />
          </Link>
        </div>

        <div
          className={`max-w-sm w-fit  rounded-bl-3xl shadow-sm  p-2 px-4 space-x-3 justify-between bg-slate-800 bg-opacity-20 backdrop-blur-sm flex items-center`}
        >
          <div className="flex space-x-4 items-center ">
            <ThemeButton />
            <Link href={"/upload"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-10 h-10 cursor-pointer rounded-full hover:scale-105 transition-all duration-300 ease-in-out  text-[rgb(50,215,75)] bg-slate-50 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Link>
          </div>
          {loading ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 mr-2 text-gray-600 animate-spin dark:text-gray-600 fill-gray-100"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : currentUser ? (
            <Link href={`/${currentUser.username}?profileId=${currentUser.uid}`}>
              <div className="flex space-x-1 items-center p-1 px-2 cursor-pointer rounded-xl hover:scale-105 transition-all duration-300 ease-in-out bg-white">
                <p className="hidden lg:block font-semibold text-base ">
                  {currentUser.username}
                </p>
                <div className="relative  h-8 w-8 rounded-lg ">
                  <Image
                    src={currentUser.profile_picture_url}
                    fill
                    className="object-cover rounded-full"
                    alt={"🎬🎞️"}
                  />
                </div>
              </div>
            </Link>
          ) : (
            <Link href={"/signin"}>
              <div className="flex items-center p-1 px-2 cursor-pointer rounded-lg hover:scale-105 transition-all duration-300 ease-in-out bg-white">
                <p className="font-semibold text-base text-gray-800 ">signin</p>
              </div>
            </Link>
          )}
        </div>
      </div>
      {loading ? (
        <Loader count={1} className="" />
      ) : profileData ? (
        <>
          <div className="bg-white flex flex-col w-full max-w-2xl mx-auto border items-center space-y-6 p-12 shadow-sm rounded-b-3xl ">
            <div className="w-min border-2 rounded-full border-b-black border-transparent transform -rotate-[25deg]">
              <div className="border-2 border-t-black w-min  transform rotate-[70deg] border-transparent aspect-square rounded-full">
                <div className="h-40 w-40 relative transform-cpu -rotate-45 overflow-hidden border-transparent rounded-full border-2 border-l-black  ">
                  <Image
                    src={profileData.profile_picture_url}
                    fill
                    className="object-cover w-full h-full p-4 rounded-full"
                    alt={""}
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="font-semibold text-lg">
                {profileData.username}{" "}
                <CheckBadgeIcon className="text-blue-500 h-8 w-8 inline " />{" "}
              </p>
            </div>
            <div className="flex justify-center space-x-14 py-4">
              <div className="text-center">
                <p className="font-bold ">92k</p>
                <p className="font-medium text-gray-400">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold ">{profileData.posts.length}</p>
                <p className="font-medium text-gray-400">Posts</p>
              </div>
              <div className="text-center">
                <p className="font-bold ">250</p>
                <p className="font-medium text-gray-400">Following</p>
              </div>
            </div>
          </div>
          <PostsList
            profileId={profileData?.userId}
            onPostClick={onPostClick}
            posts={profileData?.posts}
          />
          {modalOpen && selectedPost && (
            <div className="fixed z-20 flex items-center justify-center bg-black inset-0 bg-opacity-40">
              <div
                ref={modalContentRef}
                className="h-full max-h-[80vh] flex justify-center space-x-1"
              >
                <div
                  onClick={togglePlay}
                  className="video-wrapper relative flex justify-center items-center overflow-hidden h-full w-[335px]  dark:bg-gray-600 bg-slate-50 rounded-xl bg-center bg-cover bg-no-repeat"
                  style={{
                    backgroundImage: `url(${selectedPost.postThumbnailUrl})`,
                  }}
                >
                  <video
                    src={selectedPost.postVideoUrl}
                    ref={videoRef}
                    controlsList="nodownLoad"
                    loop
                    autoPlay
                    //onEnded={onEnded}
                    muted={isMuted}
                    onTimeUpdate={() => {
                      handleOnTimeUpdate();
                    }}
                    className="h-full w-[335px] pointer-events-none object-cover object-center  rounded-lg"
                  />

                  <div className="opacity-0 hover:opacity-100 absolute z-20 bg-gradient-to-t bg-opacity-5 from-gray-900 via-transparent to-transparent w-full h-full">
                    {!isPlaying ? (
                      <PlayIcon
                        className=" absolute top-2 left-2 w-6 h-6 text-white cursor-pointer"
                        onClick={togglePlay}
                      />
                    ) : (
                      <PauseIcon
                        className="w-6 h-6 absolute top-2 left-2 text-white cursor-pointer"
                        onClick={togglePlay}
                      />
                    )}
                    <div className="sm:hidden  absolute right-0 top-1/2 transform-cpu -translate-y-1/2 flex flex-col justify-end p-3 space-y-8 rounded-md ">
                      <HeartIcon
                        onClick={handleLike}
                        className={`videoplayer_element_onscreen ${
                          liked && "text-[#FF0084] dark:text-[#FF0084]"
                        }`}
                      />
                      <HandThumbDownIcon
                        onClick={handleDislike}
                        className={`videoplayer_element_onscreen ${
                          !liked &&
                          "text-gray-900 bg-white bg-opacity-25 backdrop-blur-md"
                        }`}
                      />

                      <ChatBubbleBottomCenterTextIcon onClick={()=>setCommentBoxOpen(!CommentBoxOpen)} className=" videoplayer_element_onscreen" />
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
                        {selectedPost.postTitle}
                      </p>
                      <div className="flex justify-between px-4 pb-2">
                        <div className="flex items-center">
                          <div className="relative w-9 h-9 rounded-full ">
                            <Image
                              fill
                              src={selectedPost.user_profile_pic_url}
                              className="object-cover object-center"
                              alt={"😍"}
                            />
                          </div>
                          <p className="text-gray-100 text-sm">
                            @{selectedPost.username}
                          </p>
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
                      <div className="w-full bg-gray-200 rounded-full h-0.5 dark:bg-gray-700">
                        <div
                          className="bg-red-600 h-0.5 rounded-full dark:bg-red-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col justify-end p-3 space-y-8 rounded-md ">
                  <div>
                    <HeartIcon
                      onClick={handleLike}
                      className={`videoplayer_element ${
                        liked && "text-[#FF0084] dark:text-[#FF0084]"
                      }`}
                    />
                  </div>
                  <div className="">
                    <HandThumbDownIcon
                      onClick={handleDislike}
                      className={`videoplayer_element ${
                        !liked && "text-white bg-gray-500"
                      }`}
                    />
                  </div>
                  <div onClick={()=>setCommentBoxOpen(!CommentBoxOpen)} className="">
                    <ChatBubbleBottomCenterTextIcon className=" videoplayer_element" />
                  </div>
                  <div>
                    <ArrowDownTrayIcon
                      // onClick={handleDownload}
                      className="  videoplayer_element cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <EllipsisHorizontalCircleIcon className="videoplayer_element " />
                  </div>
                  <div>
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
                {CommentBoxOpen && <CommentBox post={selectedPost} currentUser={currentUser}  />}
              </div>
            </div>
          )}
        </>
      ) : (
        <p>no Profile found</p>
      )}
    </div>
  );
};

export default Profile;
