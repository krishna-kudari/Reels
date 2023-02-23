import VideoDetailsForm from "@/components/VideoDetailsForm";
import VideoThumbnailForm from "@/components/VideoThumbnailForm";
import VideoVisibiityForm from "@/components/VideoVisibiityForm";
import useMultistepForm from "@/hooks/useMultistepForm";
import { uuidv4 } from "@firebase/util";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useState } from "react";

type FormData = {
  videoTitle: string;
  videoDescription: string;
  thumbnail: File | null;
  visibility: string;
};

const INITAL_DATA: FormData = {
  videoTitle: "",
  videoDescription: "",
  thumbnail: null,
  visibility: 'public'
};

const Page: React.FC<{}> = ({}) => {
  const [data, setData] = useState(INITAL_DATA);
  let [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  function updateFields(fields: Partial<FormData>) {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  }

  const { steps, currentStepIndex, step:StepComponent , isFirstStep,isLastStep, back, next } = useMultistepForm([
    <VideoDetailsForm {...data} updateFields={updateFields} />,
    <VideoThumbnailForm {...data} updateFields={updateFields} />,
    <VideoVisibiityForm {...data} updateFileds={updateFields} />
  ])

  function onSubmit (e: FormEvent) {
    e.preventDefault();
    if(!isLastStep) return next();
    setLoading(true);
    console.log(data);
    
    const postId = uuidv4();

  }

  return (
    <div className="flex min-h-screen  justify-center items-center bg-gradient-to-br from-slate-700 to-slate-900 ">
      <div className="mx-auto min-h-[90vh]  w-full max-w-7xl rounded bg-white shadow flex flex-col">
        <div className="flex justify-between rounded p-8">
          {
            steps.map((_:any, index:number) => 
            <Step key={index+1} step={index+1} currentStep={step} />
            )
          }
        </div>
        {StepComponent}
        <div className="px-8 pb-8 pt-2">
          <div className=" flex justify-between">
            <button
              type="button"
              onClick={() =>{setStep(step > 1 ? step-1:step);back();}}
              className="rounded px-2 py-1 hover:bg-gray-200  text-slate-400 hover:text-slate-700"
            >
              Back
            </button>
            <button
              type="submit"
              onClick={(e) => {setStep(step < steps.length ? step+1:step); onSubmit(e);}}
              className={`bg flex items-center justify-center rounded-full bg-blue-500 py-1.5 px-3.5 font-medium tracking-tight text-white hover:bg-blue-600 active:bg-blue-700`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

type stepProps = {
  step: number;
  currentStep: number;
}
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
        className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-400 bg-white font-semibold text-slate-500"
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
  className: string
}

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
    borderColor: "var(--slate-200)",
    color: "var(--slate-400)",
  },
  active: {
    background: "var(--white)",
    borderColor: "var(--blue-500)",
    color: "var(--blue-500)",
  },
  complete: {
    background: "var(--blue-500)",
    borderColor: "var(--blue-500)",
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
    background: "var(--blue-200)",
  },
  active: {
    background: "var(--blue-200)",
    scale: 1,
    transition: {
      duration: t(0.3),
      type: "tween",
      ease: "circOut",
    },
  },
  complete: {
    background: "var(--blue-200)",
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
