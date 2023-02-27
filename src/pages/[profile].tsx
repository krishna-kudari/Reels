import Loader from "@/components/Loader";
import { db } from "@/firebase/store";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { google_mark_colored } from "public/assets";
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
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
interface profileProps {}

const profile: React.FC<profileProps> = ({}) => {
  const router = useRouter();
  const [profileData, setProfileData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<
    (DocumentData & { id: string }) | null
  >(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  const {
    isPlaying,
    isMuted,
    togglePlay,
    toggleMute,
    handleOnTimeUpdate,
    progress,
  } = useVideoPlayer({ videoElement: videoRef });
  const { currentUser } = useAuth();
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

  console.log(router.query.profileId);

  const onPostClick = (post: DocumentData & { id: string }) => {
    console.log("modal", post);
    setSelectedPost(post);
    setModalOpen(true);
  };
  const handleModalClick = (event: React.SyntheticEvent) => {
    // if (!modalContentRef?.current?.contains(event.currentTarget)) {
    //   setModalOpen(false);
    //   setSelectedPost(null);
    // }
  };
  return (
    <div className="bg-gray-100 px-2 min-h-screen">
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
                    className="object-cover w-full h-full p-4"
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
                <p className="font-bold ">350</p>
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
            <div
              onClick={handleModalClick}
              className="fixed z-20 flex items-center justify-center bg-black inset-0 bg-opacity-40"
            >
              <div
                ref={modalContentRef}
                className="h-full border max-h-[80vh] flex justify-center space-x-1"
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
                        // onClick={handleLike}
                        className={`videoplayer_element_onscreen ${"text-[#FF0084] dark:text-[#FF0084]"}`}
                      />
                      <HandThumbDownIcon
                        // onClick={handleDislike}
                        className={`videoplayer_element_onscreen ${"text-gray-900 bg-white bg-opacity-25 backdrop-blur-md"}`}
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
                    // onClick={handleLike}
                    className={`videoplayer_element ${"text-[#FF0084] dark:text-[#FF0084]"}`}
                  />
                  <HandThumbDownIcon
                    // onClick={handleDislike}
                    className={`videoplayer_element ${"text-white bg-gray-500"}`}
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
            </div>
          )}
        </>
      ) : (
        <p>no Profile found</p>
      )}
    </div>
  );
};

export default profile;
