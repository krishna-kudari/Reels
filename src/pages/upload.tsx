import React, { useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { motion, useAnimation } from "framer-motion";
import PublishWizard from "@/components/PublishWizard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import { storage } from "@/firebase/storage";
import { uuidv4 } from "@firebase/util";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";
interface uploadProps {}

const upload: React.FC<uploadProps> = ({}) => {
  const router = useRouter();
  const { loading, currentUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [postId, setPostId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [downloadVideoUrl, setDownloadVideoUrl] = useState("");
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      accept: {
        "video/mp4": [".mp4"],
        "video/webm": [".webm"],
        "video/ogg": [".ogg"],
      },
      onDrop: (acceptedFiles) => {
        if(acceptedFiles.length == 0)return;
        setSelectedFile(acceptedFiles[0]);
        // uploadVideo(acceptedFiles[0]);
        console.log(acceptedFiles);
        animate();
      },
      maxFiles: 1,
      maxSize: 20000000,
    });

  function uploadVideo(video: File) {
    if (!video) {
      alert("No video selected");
      return setAnimationCompleted(false);
    }
    console.log("publish useEff");
    setUploading(true);
    try {
      const postId = uuidv4();
      setPostId(postId);
      const post_ref = ref(storage, `posts/${postId}/video`);
      uploadBytes(post_ref, video).then(async (snapshot) => {
        console.log("uploaded");
        const videoDownloadUrl = await getDownloadURL(snapshot.ref);
        console.log(videoDownloadUrl);
        setDownloadVideoUrl(videoDownloadUrl);
        toast.success("video uploaded");
      });
    } catch (error: any) {
      setPostId("");
      console.log("uploadVideo Error:", error);
      toast.error("whoops! something wnet wrong");
    } finally {
      setUploading(false);
    }
  }
  const dropanimation = useAnimation();
  const checkAnimation = useAnimation();
  const checkMarkAnimation = useAnimation();
  const animate = async () => {
    console.log("animating");
    setIsAnimating(true);
    await dropanimation.start({
      display: "flex",
      borderRadius: "50%",
      inset: "50%",
    });
    await dropanimation.start({
      borderRadius: "0",
      inset: 0,
      transition: { duration: 0.3 },
    });
    await checkAnimation.start({
      pathLength: 0,
    });
    await checkMarkAnimation.start({
      width: "64",
      height: "64",
      transition: { delay: 0.5, duration: 0 },
    });
    await checkAnimation.start({
      pathLength: 1,
      transition: { duration: 0.3 },
    });
    await dropanimation.start({
      inset: "50%",
      transition: { delay: 1, duration: 0.1 },
    });
    await checkMarkAnimation.start({
      width: 0,
      height: 0,
    });
    setIsAnimating(false);
    setAnimationCompleted(true);
  };
  //Redirect to signin page.
  function RedirectSignup() {
    router.replace("/signin");
    return <></>;
  }

  return (
    <>
      {loading ? (
        <Loader count={1} className={"animate-pulse top-32 bg-slate-50 bg-gradient-to-br dark:from-gray-500 dark:to-gray-700 border relative border-gray-100 shadow rounded-3xl  w-full mx-auto  max-w-[80vh] min-h-[60vh]"} />
      ) : currentUser ? (
        <div className="flex min-h-screen items-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-900 ">
          { animationCompleted && selectedFile ? (
            <PublishWizard
              video={selectedFile}
              user={currentUser}
              setAnimationCompleted={setAnimationCompleted}
              uploading={uploading}
              postId={postId}
              downloadVideoUrl={downloadVideoUrl}
            />
          ) : (
            <div className="mx-auto relative flex flex-col rounded-3xl overflow-hidden bg-white dark:bg-gray-700 w-[95vw] max-w-3xl border border-slate-100 dark:border-gray-500 shadow-sm">
              <div className="w-full border-b dark:border-b-gray-500 flex justify-between items-center bg-white dark:bg-gray-700">
                <p className="text-xl font-bold text-slate-800 dark:text-gray-300 p-4 ">
                  Upload a video
                </p>
                <div
                  onClick={() => router.replace("/")}
                  className=" rounded-full bg-gray-100 dark:bg-gray-600 p-1 mr-4"
                >
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 -50 700 700"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <path d="m231.76 444.44c-11.594-0.011718-22.711-4.625-30.91-12.824-8.1953-8.2031-12.801-19.324-12.801-30.922 0-11.594 4.6016-22.715 12.793-30.922l241.15-241.15c11.117-10.727 27.07-14.797 41.965-10.703 14.898 4.0898 26.535 15.738 30.613 30.637 4.0781 14.902-0.007812 30.852-10.746 41.957l-241.32 241.15c-8.1562 8.1523-19.207 12.746-30.742 12.773z" />
                    <path d="m472.91 444.44c-11.605 0.003906-22.73-4.6133-30.918-12.832l-241.15-241.09c-10.051-11.199-13.637-26.781-9.5-41.25 4.1367-14.469 15.422-25.793 29.875-29.988 14.453-4.1914 30.047-0.66016 41.285 9.3477l241.32 241.15c8.1953 8.207 12.797 19.328 12.797 30.922-0.003906 11.598-4.6055 22.719-12.805 30.922-8.1953 8.1992-19.312 12.812-30.906 12.824z" />
                  </svg>
                </div>
              </div>
              <div className="h-full w-full ">
                <label
                  {...getRootProps()}
                  htmlFor="video_input_1"
                  className={`py-16  flex flex-col justify-center items-center space-y-4 cursor-pointer ${
                    isDragActive
                      ? "bg-gray-100 dark:bg-slate-500 border border-gray-300 dark:border-slate-400 border-dashed"
                      : "border border-transparent"
                  }`}
                >
                  <div className="">
                    <svg
                      className="text-indigo-500 w-24"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Drag and drop</span> or
                      Click here drop
                    </p>
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                      MP4, WebM OR OGG (MAX. 20 MB)
                    </p>
                  </div>
                  <div className="p-6 py-3 inline-flex bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg text-white">
                    Browse
                  </div>
                </label>
                <input {...getInputProps()} />
              </div>

              <motion.div
                animate={dropanimation}
                className="absolute rounded-full bg-indigo-500 hidden inset-1/2 items-center justify-center text-white overflow-hidden"
              >
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={4}
                  animate={checkMarkAnimation}
                  stroke="currentColor"
                  className="w-16 h-16 hidden"
                >
                  <motion.path
                    animate={checkAnimation}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </motion.svg>
              </motion.div>
            </div>
          )}
        </div>
      ) : (
        <RedirectSignup />
      )}
    </>
  );
};

export default upload;
