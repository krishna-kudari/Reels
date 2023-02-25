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
  setFrmaeZUrl:  Dispatch<SetStateAction<string>>

};
const VideoDetailsForm: React.FC<VideoDetailsFormProps & VideoDetailsProps> = ({
  videoTitle,
  videoDescription,
  updateFields,
  videoUrl,
  uploading,
  videoRef,
  setFrmaeZUrl
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
              className=" rounded-lg bg-gray-50 border text-gray-900  focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
            className="block p-2.5 w-full text-sm resize-none text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Tell something about your video"
          ></textarea>
        </div>
        <div className="w-2/5">
          <div className="w-full h-60 border dark:border-gray-500 rounded-md overflow-hidden bg-slate-700">
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full h-full object-contain"
            ></video>
          </div>
        </div>
      </div>
    </FormWrapper>
  );
};

export default VideoDetailsForm;
