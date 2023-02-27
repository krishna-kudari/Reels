import { db } from "@/firebase/store";
import {
  PlayIcon,
  PauseIcon,
  HeartIcon,
  HandThumbDownIcon,
  ChatBubbleBottomCenterTextIcon,
  EllipsisHorizontalCircleIcon,
  SpeakerXMarkIcon,
  SpeakerWaveIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/solid";
import {
  collection,
  doc,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface PostsListProps {
  profileId: string;
  onPostClick: (post: DocumentData & { id: string }) => void;
  posts: Array<string>;
}

const PostsList: React.FC<PostsListProps> = ({
  profileId,
  onPostClick,
  posts: postIds,
}) => {
  const [posts, setPosts] = useState<Array<DocumentData & { id: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [lastPostFetched, setLastPostFetched] = useState<DocumentData | null>(
    null
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "posts"),
          where("userId", "==", profileId),
          orderBy("createdAt", "desc"),
          limit(12)
        );
        const querySnapshot = await getDocs(q);
        const newPosts: Array<DocumentData & { id: string }> = [];
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ");
          newPosts.push({ id: doc.id, ...doc.data() });
        });
        setPosts(newPosts);
        setLastPostFetched(querySnapshot.docs[querySnapshot.docs.length - 1]);
        console.log("Fetch Posts useEffect", "----First 15");
      } catch (error: any) {
        console.log("Fetch posts useEffect", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLoadMore = async () => {
    try {
      setMoreLoading(true);
      const q = query(
        collection(db, "posts"),
        where("userId", "==", profileId),
        orderBy("createdAt", "desc"),
        startAfter(lastPostFetched),
        limit(12)
      );
      const querySnapshot = await getDocs(q);
      const newPosts: Array<DocumentData & { id: string }> = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>");
        newPosts.push({ id: doc.id, ...doc.data() });
      });
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      if(querySnapshot.docs.length )setLastPostFetched(querySnapshot.docs[querySnapshot.docs.length - 1]);
      console.log("HandleMore Posts");
    } catch (error: any) {
      console.log("handleLoadMore Posts:", error);
    } finally {
      setMoreLoading(false);
    }
  };

  return (
    <section className="overflow-hidden pt-6">
      {loading ? (
        <div role="status" className="mx-auto w-min">
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
      ) : (
        <div className="container mx-auto px-4 py-12 rounded-t-3xl shadow-sm bg-white lg:px-32 lg:pt-12">
          <div className="-m-1 flex flex-wrap md:-m-2 pb-4">
            {posts.map((post: DocumentData & { id: string }, index) => (
              <div key={post.id} className="flex w-1/2 p-1 md:p-2 overflow-hidden md:w-1/3 lg:w-1/4 ">
                <div
                  onClick={() => onPostClick(post)}
                  className="relative border w-fit rounded-2xl overflow-hidden"
                >
                  <img
                    src={post.postThumbnailUrl}
                    className="border shadow-sm "
                    alt="❤️🙌"
                  />
                  <div className="absolute backdrop-blur-[1] inset-0 z-10 bg-gradient-to-t opacity-0 transition-all duration-300 ease-in hover:opacity-100 from-[#212121aa] via-[#00000044] to-[#1f1f1fdd] flex justify-center space-x-2 items-center">
                    <div className="flex space-x-1 items-center">
                      <HeartIcon className="w-9 h-9 p-1 bg-gray-500 rounded-full bg-opacity-20 backdrop-blur-sm text-gray-300" />
                      <p className="text-stone-100">90k</p>
                    </div>
                    <div className="flex space-x-1 items-center">
                      <ChatBubbleLeftRightIcon className="w-9 h-9 p-1 bg-gray-500 rounded-full bg-opacity-20 backdrop-blur-sm text-gray-300" />
                      <p className="text-stone-100">900</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleLoadMore}
            className="px-2 py-1 mx-auto flex items-center bg-gray-700 hover:scale-90 bg-opacity-50  duration-300 rounded-lg text-stone-100 text-lg font-medium"
          >
            <span>Load more</span>
            {moreLoading ? (
              <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 mr-2 p-1 text-gray-600 animate-spin dark:text-gray-600 fill-gray-100"
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
            ) : (
              <ChevronDoubleDownIcon className="w-6 h-6 inline mt-2 pt-2 animate-bounce  " />
            )}
          </button>
        </div>
      )}
    </section>
  );
};

export default PostsList;
