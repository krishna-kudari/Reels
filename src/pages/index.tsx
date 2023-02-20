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

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostref = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

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
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && lastVisible) {
          handleLoadMore();
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
        <Loader count={4} />
      ) : currentUser ? (
        <div
          ref={rootRef}
          className="snap snap-y snap-mandatory max-h-screen h-screen overflow-y-scroll"
        >
          {posts.map((post, index) => (
            <div
              key={post.id}
              ref={posts.length === index + 1 ? lastPostref : null}
              className=" snap-always snap-center mx-auto rounded-lg w-full h-[80vh] my-[8vh]"
            >
              {/* <VideoElement   post={post} /> */}
              <video
                className="h-full object-cover object-center mx-auto border border-gray-200 rounded-lg dark:border-gray-700"
                controls
              >
                <source src="/reels/three.mp4" type="video/mp4" />
                <source src="/reels/three.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
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
