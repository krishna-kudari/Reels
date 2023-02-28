import { db } from "@/firebase/store";
import { uuidv4 } from "@firebase/util";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface commentProps {
  post: DocumentData;
  currentUser: any;
}

const comment: React.FC<commentProps> = ({ post, currentUser }) => {
  const [commentText, setCommentText] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [comments, setComments] = useState<DocumentData>([]);
  
  const handleprimaryCommentPost = async (event: React.FormEvent) => {
    console.log("commentText", commentText);
    event.preventDefault();
    try {
      setPublishing(true);
      const commentId = uuidv4();
      const commentData = {
        _id: commentId,
        author_id: currentUser.uid,
        author_profile_pic_url: currentUser.profile_picture_url,
        author_name: currentUser.username,
        content: commentText,
        postId: post.postId,
        createdAt: serverTimestamp(),
        parentCommentId: post.postId,
      };
      await setDoc(doc(db, "comments", commentId), commentData);
      const postRef = doc(db,'posts',post.postId);
      await updateDoc(postRef, {
        commentsCount: post.commentsCount+1,
      })
      setCommentText("");
    } catch (error: any) {
      console.log(error);
      toast.error("error.message");
    } finally {
      setPublishing(false);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const q = query(
          collection(db, "comments"),
          where("postId", "==", post.postId),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const newComments: Array<DocumentData & { id: string }> = [];
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ");
          newComments.push({ id: doc.id, ...doc.data() });
        });
        setComments(newComments);
        // setLastCommentsFetched(querySnapshot.docs[querySnapshot.docs.length - 1]);
        console.log("Fetch Posts useEffect", "----First 15");
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    };
    getComments();
  }, [publishing]);

  return (
    <div className="w-max bg-stone-50 border rounded-3xl flex-col flex overflow-hidden">
      {/* comment Text box */}
      <form
        onSubmit={handleprimaryCommentPost}
        className="flex space-x-4 p-3 py-4 items-center"
      >
        <input
          placeholder="write...."
          type="text"
          required
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          className="p-2 border w-full flex-1 rounded-md outline-none focus:scale-105 duration-200 focus:border-gray-400"
          name="commentText"
          id="commentText"
        />
        <button disabled={publishing} type="submit">
          <PaperAirplaneIcon
            // onClick={handleprimaryCommentPost}
            className="w-10 h-10 p-2 text-gray-400 rounded-full bg-white"
          />
        </button>
      </form>
      <hr className="w-full " />
      {/* comments List */}
      <div id="comment_box" className="overflow-y-auto">

      {comments?.map((comment: DocumentData, index: number) => (
        <div key={comment._id} className="">
        <div className="bg-white dark:bg-gray-800 text-black dark:text-gray-200 p-4 antialiased flex w-full max-w-lg">
          <img
            alt="❤️"
            className="rounded-full h-8 w-8 mr-2 mt-1 "
            src={comment.author_profile_pic_url}
          />
          <div className="flex-1">
            <div className="bg-gray-100  dark:bg-gray-700 rounded-3xl px-4 pt-2 pb-2.5">
              <div className="font-semibold text-sm leading-relaxed">
                {comment.author_name}
              </div>
              <div className="text-normalleading-snug md:leading-normal">
                {comment.content}
              </div>
            </div>
            <div className="text-sm ml-4 mt-0.5 text-gray-500 dark:text-gray-400">
              14 w
            </div>
            <div className="bg-white dark:bg-gray-700 border border-white dark:border-gray-700 rounded-full float-right -mt-8 mr-0.5 flex shadow items-center ">
              <svg
                className="p-0.5 h-5 w-5 rounded-full z-20 bg-white dark:bg-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 16 16"
              >
                <defs>
                  <linearGradient id="a1" x1="50%" x2="50%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#18AFFF" />
                    <stop offset="100%" stopColor="#0062DF" />
                  </linearGradient>
                  <filter
                    id="c1"
                    width="118.8%"
                    height="118.8%"
                    x="-9.4%"
                    y="-9.4%"
                    filterUnits="objectBoundingBox"
                    >
                    <feGaussianBlur
                      in="SourceAlpha"
                      result="shadowBlurInner1"
                      stdDeviation="1"
                    />
                    <feOffset
                      dy="-1"
                      in="shadowBlurInner1"
                      result="shadowOffsetInner1"
                      />
                    <feComposite
                      in="shadowOffsetInner1"
                      in2="SourceAlpha"
                      k2="-1"
                      k3="1"
                      operator="arithmetic"
                      result="shadowInnerInner1"
                    />
                    <feColorMatrix
                      in="shadowInnerInner1"
                      values="0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0"
                    />
                  </filter>
                  <path
                    id="b1"
                    d="M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z"
                  />
                </defs>
                <g fill="none">
                  <use fill="url(#a1)" xlinkHref="#b1" />
                  <use fill="black" filter="url(#c1)" xlinkHref="#b1" />
                  <path
                    fill="white"
                    d="M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z"
                  />
                </g>
              </svg>
              <svg
                className="p-0.5 h-5 w-5 rounded-full -ml-1.5 bg-white dark:bg-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 16 16"
              >
                <defs>
                  <linearGradient id="a2" x1="50%" x2="50%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#FF6680" />
                    <stop offset="100%" stopColor="#E61739" />
                  </linearGradient>
                  <filter
                    id="c2"
                    width="118.8%"
                    height="118.8%"
                    x="-9.4%"
                    y="-9.4%"
                    filterUnits="objectBoundingBox"
                  >
                    <feGaussianBlur
                      in="SourceAlpha"
                      result="shadowBlurInner1"
                      stdDeviation="1"
                      />
                    <feOffset
                      dy="-1"
                      in="shadowBlurInner1"
                      result="shadowOffsetInner1"
                    />
                    <feComposite
                      in="shadowOffsetInner1"
                      in2="SourceAlpha"
                      k2="-1"
                      k3="1"
                      operator="arithmetic"
                      result="shadowInnerInner1"
                    />
                    <feColorMatrix
                      in="shadowInnerInner1"
                      values="0 0 0 0 0.710144928 0 0 0 0 0 0 0 0 0 0.117780134 0 0 0 0.349786932 0"
                    />
                  </filter>
                  <path id="b2" d="M8 0a8 8 0 100 16A8 8 0 008 0z" />
                </defs>
                <g fill="none">
                  <use fill="url(#a2)" xlinkHref="#b2" />
                  <use fill="black" filter="url(#c2)" xlinkHref="#b2" />
                  <path
                    fill="white"
                    d="M10.473 4C8.275 4 8 5.824 8 5.824S7.726 4 5.528 4c-2.114 0-2.73 2.222-2.472 3.41C3.736 10.55 8 12.75 8 12.75s4.265-2.2 4.945-5.34c.257-1.188-.36-3.41-2.472-3.41"
                  />
                </g>
              </svg>
              <span className="text-sm ml-1 pr-1.5 text-gray-500 dark:text-gray-300">
                3
              </span>
            </div>
          </div>
        </div>
          <hr className="w-full " />
        </div>
      ))}
      </div>
    </div>
  );
};

export default comment;
