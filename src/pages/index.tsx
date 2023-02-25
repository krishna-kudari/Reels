import Header from "@/components/header";
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
import Head from "next/head";
import { useRouter } from "next/router";
import { reels_mark_solid, google_mark_colored } from "public/assets";
import { useEffect, useRef, useState } from "react";

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
        console.log("entries",entries);
        
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
      <div className="absolute top-0 w-screen bg-gray-100 bg-opacity-5 backdrop-blur-sm border-1 flex justify-between">
      <div
        className={`w-[calc(50%-230px)] rounded-br-3xl shadow-sm p-2 px-4 space-x-2 justify-between bg-gray-200 bg-opacity-20 backdrop-blur-sm flex items-center`}
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
          <p className="font-bold text-xl text-slate-900 ">reels</p>
        </div>
        <HomeIcon className="h-8 w-8  text-gray-900" />
      </div>

      <div
        className={`w-[calc(50%-220px)] rounded-bl-3xl shadow-sm  p-2 px-4 space-x-2 justify-between bg-slate-800 bg-opacity-20 backdrop-blur-sm flex items-center`}
      > 
      <div className="flex space-x-4 items-center ">
        <ThemeButton />
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
      </div>

        <div className="flex space-x-1 items-center p-1 px-2 cursor-pointer rounded-xl hover:scale-105 transition-all duration-300 ease-in-out bg-white">
          <p className="font-semibold text-base ">IAmKRS</p>
          <div className="relative  h-8 w-8 rounded-lg ">
            <Image
              src={google_mark_colored}
              fill
              className="object-cover"
              alt={"🎬🎞️"}
            />
          </div>
        </div>
      </div>
    </div>
      {loading ? (
        <Loader count={4} className={"animate-pulse bg-slate-50 bg-gradient-to-br dark:from-gray-500 dark:to-gray-700 border relative border-gray-100 shadow rounded-3xl  w-full mx-auto  max-w-[350px] min-h-[80vh]"} />
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
                observer = {observer}
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
