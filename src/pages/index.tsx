import Loader from "@/components/Loader";
import VideoElement from "@/components/VideoElement";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/store";
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
      {loading ? (
        <Loader count={4} className={"animate-pulse bg-slate-50 border relative border-gray-100 shadow rounded-3xl mt-[5vh] w-full mx-auto mb-6 max-w-[350px] min-h-[80vh]"} />
      ) : currentUser ? (
        <div
          ref={rootRef}
          id="snap_container"
          className="snap snap-y snap-mandatory max-h-screen h-screen overflow-y-scroll"
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
