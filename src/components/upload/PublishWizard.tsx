import VideoDetailsForm from "@/components/upload/VideoDetailsForm";
import VideoThumbnailForm from "@/components/upload/VideoThumbnailForm";
import VideoVisibiityForm from "@/components/upload/VideoVisibiityForm";
import { storage } from "@/firebase/storage";
import { db } from "@/firebase/store";
import useMultistepForm from "@/hooks/useMultistepForm";
import { uuidv4 } from "@firebase/util";
import { ArrowRightIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { User } from "firebase/auth";
import {
  arrayUnion,
  doc,
  DocumentData,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type FormData = {
  videoTitle: string;
  videoDescription: string;
  thumbnail: File | Blob | null;
  thumb1: File | Blob | null;
  thumb2: File | Blob | null;
  visibility: string;
  tags: Array<string>;
  code: string;
};

const INITAL_DATA: FormData = {
  videoTitle: "",
  videoDescription: "",
  thumbnail: null,
  thumb1: null,
  thumb2: null,
  visibility: "public",
  tags: [],
  code: "",
};
interface PublishWizardProps {
  video: File | null;
  user: User & DocumentData;
  setAnimationCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  postId: string;
  uploading: boolean;
  downloadVideoUrl: string;
  videoName: string;
  progress: number;
}
const Page: React.FC<PublishWizardProps> = ({
  video,
  user,
  setAnimationCompleted,
  postId,
  uploading,
  downloadVideoUrl,
  videoName,
  progress,
}) => {
  const [data, setData] = useState(INITAL_DATA);
  let [step, setStep] = useState(1);
  const [frameZUrl, setFrameZUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState(() => {
    if (!video) return "";
    return URL.createObjectURL(video);
  });
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  function updateFields(fields: Partial<FormData>) {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  }

  const {
    steps,
    currentStepIndex,
    step: StepComponent,
    isFirstStep,
    isLastStep,
    back,
    next,
  } = useMultistepForm([
    <VideoDetailsForm
      key={0}
      {...data}
      updateFields={updateFields}
      videoUrl={videoUrl}
      uploading={uploading}
      videoRef={videoRef}
      setFrmaeZUrl={setFrameZUrl}
      videoName={videoName}
      progress={progress}
    />,
    <VideoThumbnailForm
      key={1}
      {...data}
      updateFields={updateFields}
      videoRef={videoRef}
      frameZUrl={frameZUrl}
      videoUrl={videoUrl}
    />,
    <VideoVisibiityForm key={2} {...data} updateFileds={updateFields} />,
  ]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isLastStep) return next();

    console.log(data);
    console.log(video);
    if (!user) return;
    let thumbnailUrl = "";
    if (data.thumbnail && !!downloadVideoUrl) {
      console.log(downloadVideoUrl);
      setLoading(true);
      const notification = toast.loading("publishing");
      try {
        const thumbnail_ref = ref(storage, `posts/${postId}/thumbnail`);
        uploadBytes(thumbnail_ref, data.thumbnail).then(async (snapshot) => {
          console.log("uploaded Thumbnail");
          const thumbnailDownloadUrl = await getDownloadURL(snapshot.ref);
          console.log(thumbnailDownloadUrl);
          thumbnailUrl = thumbnailDownloadUrl;
          const postDoc = {
            postId: postId,
            postVideoUrl: downloadVideoUrl,
            postThumbnailUrl: thumbnailUrl,
            createdAt: serverTimestamp(),
            postTitle: data.videoTitle,
            description: data.videoDescription,
            userId: user.uid,
            username: user.username,
            user_profile_pic_url: user.profile_picture_url,
            likes: [],
            commentsCount: 0,
            visibility: data.visibility,
            tags: data.tags,
            code: data.code,
          };
          await setDoc(doc(db, "posts", postId), postDoc);
          toast.success("published", {
            id: notification,
          });
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            posts: arrayUnion(postId),
          });
          //animate
          setStep(steps.length + 1);
          setAnimationCompleted(false);
        });
      } catch (error: any) {
        console.log(error);
        toast.error("whoops! something went wrong", { id: notification });
      } finally {
        setLoading(false);
      }
    } else {
      if (!data.thumbnail) {
        toast.error("please choose a thumbnail");
      } 
      if (uploading) {
        toast.error("wait uploading vedio");
      }
    }
  }

  return (
    <div className="mx-auto min-h-[85vh]  w-full max-w-6xl rounded-3xl bg-white dark:bg-systemGrayDark-300 border-slate-100 dark:border-none shadow flex flex-col">
      <div className="flex justify-between rounded p-8">
        {steps.map((_: any, index: number) => (
          <Step key={index + 1} step={index + 1} currentStep={step} />
        ))}
      </div>
      {StepComponent}
      <div className="px-8 pb-8 pt-2">
        <div className=" flex justify-between">
          <button
            type="button"
            onClick={() => {
              setStep(step > 1 ? step - 1 : step);
              if (step == 1) {
                setAnimationCompleted(false);
              }
              back();
            }}
            className="rounded-full px-2 py-1 hover:bg-gray-200  dark:text-systemLbDark-300 dark:hover:bg-systemGrayDark-200 dark:hover:text-white hover:text-slate-700"
          >
            Back
          </button>
          <button
            type="submit"
            onClick={(e) => {
              setStep(step < steps.length ? step + 1 : step);
              onSubmit(e);
            }}
            className={`bg animate-bouncex flex items-center justify-center rounded-full bg-blue-500 p-2 font-medium tracking-tight text-white hover:bg-blue-600 active:bg-blue-700`}
          >
            <ArrowRightIcon className="white w-4 h-4 " />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;

type stepProps = {
  step: number;
  currentStep: number;
};
function Step({ step, currentStep }: stepProps) {
  let status =
    currentStep === step
      ? "active"
      : currentStep < step
      ? "inactive"
      : "complete";

  return (
    <motion.div animate={status} initial={status} className="relative">
      <motion.div
        transition={rippleTransition}
        variants={rippleVariants}
        className="absolute inset-0 rounded-full"
      />

      <motion.div
        variants={backgroundVariants}
        transition={backgroundTransition}
        className={` ${
          status == "inactive" &&
          "bg-slate-200 border-gray-400 dark:border-gray-500 dark:bg-gray-600"
        } relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-400 bg-white font-semibold text-slate-500`}
      >
        <div className="relative flex items-center justify-center">
          <AnimatePresence>
            {status === "complete" ? (
              <CheckIcon className="h-6 w-6 text-white" />
            ) : (
              <motion.span
                key="step"
                animate={{ opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="absolute"
              >
                {step}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
type checkIconProps = {
  className: string;
};

function CheckIcon(props: checkIconProps) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <motion.path
        variants={checkIconVariants}
        transition={checkIconTransition}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

let x = 1;
const t = (v: number) => x * v;

let backgroundTransition = { duration: t(0.2) };
let backgroundVariants = {
  inactive: {
    background: "var(--white)",
    borderColor: "var(--white)",
    color: "#FFFFFFFF",
  },
  active: {
    background: "var(--white)",
    borderColor: "#FFFFFFFF",
    color: "#FFFFFFFF",
  },
  complete: {
    background: "var(--white)",
    borderColor: "var(--white)",
  },
};

let rippleTransition = {
  duration: t(0.6),
  delay: t(0.2),
  type: "tween",
  ease: "circOut",
};

let rippleVariants = {
  inactive: {
    background: "var(--indigo-200)",
  },
  active: {
    background: "var(--indigo-200)",
    scale: 1,
    transition: {
      duration: t(0.3),
      type: "tween",
      ease: "circOut",
    },
  },
  complete: {
    background: "var(--indigo-200)",
    scale: 1.25,
  },
};

let checkIconTransition = {
  ease: "easeOut",
  type: "tween",
  delay: t(0.2),
  duration: t(0.3),
};
let checkIconVariants = {
  complete: {
    pathLength: [0, 1],
  },
};
