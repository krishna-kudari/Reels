import Image from "next/image";
import Loader from "@/components/Loader";
import ThemeButton from "@/components/ThemeButton";
import VideoElement from "@/components/VideoElement";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/store";
import { HomeIcon } from "@heroicons/react/24/solid";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { reels_mark_solid, google_mark_colored } from "public/assets";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Home() {
  const { loading, currentUser } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Array<DocumentData & { id: string }>>([]);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [newPostsLoading, setNewPostsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("");

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostref = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const interactionObserver = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setNewPostsLoading(true);
        const q = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc"),
          limit(2)
        );
        const querySnapshot = await getDocs(q);
        const newPosts: Array<DocumentData & { id: string }> = [];
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ");
          newPosts.push({ id: doc.id, ...doc.data() });
        });
        setPosts(newPosts);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        console.log("Fetch Posts useEffect", "----First 4");
      } catch (error: any) {
        console.log("Fetch posts useEffect", error);
      } finally {
        setNewPostsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLoadMore = async () => {
    try {
      setNewPostsLoading(true);
      const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(2)
      );
      const querySnapshot = await getDocs(q);
      const newPosts: Array<DocumentData & { id: string }> = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>");
        newPosts.push({ id: doc.id, ...doc.data() });
      });
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      console.log("HandleMore Posts");
    } catch (error: any) {
      console.log("handleLoadMore Posts:", error);
    } finally {
      setNewPostsLoading(false);
    }
  };

  useEffect(() => {
    if (newPostsLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        console.log("entries", entries);

        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && lastVisible) {
          // handleLoadMore();
          console.log("HandleLoad More called");
        }
      },
      {
        threshold: 1.0,
        root: rootRef.current,
      }
    );
    if (lastPostref.current) observer.current.observe(lastPostref.current);
  }, [lastVisible, newPostsLoading]);

  console.log("Home", loading, currentUser);
  return (
    <>
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
        <Loader
          count={4}
          className={
            "animate-pulse bg-slate-50 bg-gradient-to-br dark:from-gray-500 dark:to-gray-700 border relative border-gray-100 shadow rounded-3xl  w-full mx-auto  max-w-[350px] min-h-[80vh]"
          }
        />
      ) : currentUser ? (
        <div
          ref={rootRef}
          id="snap_container"
          className="snap snap-y snap-mandatory max-h-screen h-screen overflow-y-scroll bg-gradient-to-br from-white to-slate-100  dark:from-slate-700 dark:to-gray-900"
        >
          {posts.map((post, index) => (
            <div
              key={post.id}
              ref={posts.length === index + 1 ? lastPostref : null}
              className=" snap-always snap-center mx-auto rounded-lg w-full h-[80vh] my-[8vh]"
            >
              <VideoElement
                post={post}
                isActive={post.id == activeTab}
                setActiveTab={setActiveTab}
                rootref={rootRef}
                observer={observer}
                user={currentUser}
              />
            </div>
          ))}
        </div>
      ) : (
        <RedirectSignup />
      )}
    </>
  );

  //Redirect to signin page.
  function RedirectSignup() {
    router.replace("/signin");
    return <></>;
  }
}
