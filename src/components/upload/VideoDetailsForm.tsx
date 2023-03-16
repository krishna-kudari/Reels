import { FilmIcon } from "@heroicons/react/24/solid";
import React, { Dispatch, MutableRefObject, SetStateAction } from "react";
import FormWrapper from "./FormWrapper";

type VideoDetailsFormProps = VideoDetailsForm & {
  updateFields: (fileds: Partial<VideoDetailsForm>) => void;
};

type VideoDetailsForm = {
  videoTitle: string;
  videoDescription: string;
};

type VideoDetailsProps = {
  videoUrl: string;
  uploading: boolean;
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  setFrmaeZUrl:  Dispatch<SetStateAction<string>>;
  videoName: string;
  progress: number;

};
const VideoDetailsForm: React.FC<VideoDetailsFormProps & VideoDetailsProps> = ({
  videoTitle,
  videoDescription,
  updateFields,
  videoUrl,
  uploading,
  videoRef,
  setFrmaeZUrl,
  videoName,
  progress,
}) => {
  return (
    <FormWrapper title="Details">
      <div className="w-full flex py-2">
        <div className="w-3/5 px-4">
          <label
            htmlFor="title"
            className="block mb-2 text-sm font-medium text-gray-800 dark:text-white"
          >
            Title (required Field)
          </label>
          <div className="flex relative mb-6">
            <input
              type="text"
              id="title"
              value={videoTitle}
              onChange={(e) => updateFields({ videoTitle: e.target.value })}
              className=" rounded-lg bg-gray-50 border text-gray-900 outline-none block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-systemGrayDark-200 dark:border-systemSepDark-sep dark:placeholder-gray-400 dark:text-white "
              placeholder="Add video Title here"
            />
          </div>
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-800 dark:text-white"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={videoDescription}
            onChange={(e) => updateFields({ videoDescription: e.target.value })}
            className="block p-2.5 w-full text-sm resize-none text-gray-900 bg-gray-50 rounded-lg border outline-none border-gray-300 dark:bg-systemGrayDark-200 dark:border-systemSepDark-sep dark:placeholder-gray-400 dark:text-white "
            placeholder="Tell something about your video"
          ></textarea>
        </div>
        <div className="w-2/5 space-y-6">
          <div className="w-full h-60 border dark:border-systemSepDark-sep rounded-md overflow-hidden bg-systemGrayDark-200">
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full h-full object-contain"
            ></video>
          </div>

          <div className="flex w-full border border-systemSepDark-sep rounded-md items-center space-x-1 ">
            <FilmIcon className="w-12 h-12 p-1 text-systemTintDark-blue" />
            <div className="flex-1 space-y-2 p-2 text-systemLbLight-400 dark:text-systemLbDark-400">
              <div className="flex justify-between">
                <p>{`${videoUrl? videoName: "no video selected"}`}</p>
                <p >{progress}%</p>
              </div>
              <div className="rounded-xl h-2 w-full overflow-hidden bg-gray-200">
                <div style={{width:`${progress}%`}} className={` animate-pulse bg-systemTintLight-blue h-full`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormWrapper>
  );
};

export default VideoDetailsForm;
