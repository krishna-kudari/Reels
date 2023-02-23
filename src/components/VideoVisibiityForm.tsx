import React from "react";
import FormWrapper from "./FormWrapper";

type VideoVisibiityFormProps = VideoVisibiityForm & {
  updateFileds: (fields: Partial<VideoVisibiityForm>) => void;
};
type VideoVisibiityForm = {
    visibility: string;
};

const VideoVisibiityForm: React.FC<VideoVisibiityFormProps> = ({visibility,updateFileds}) => {
  return (
    <FormWrapper title="Visibility">
      <div className=" w-full h-full px-8">
        <div className="flex space-x-6">
          <div className={`flex items-center px-4 border ${visibility=='public' && 'bg-gray-200'} border-gray-200 rounded dark:border-gray-700`}>
            <input
              id="publicVideo"
              type="radio"
              value=""
              name="bordered-radio"
              onChange={(e) => updateFileds({visibility: 'public'})}
              checked={visibility=='public'}
            />
            <label
              htmlFor="publicVideo"
              className="w-full cursor-pointer py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Public
            </label>
          </div>
          <div className={`flex items-center px-4 border ${ visibility=='private' && 'bg-gray-200'} border-gray-200 rounded dark:border-gray-700`}>
            <input
              id="privateVideo"
              type="radio"
              value=""
              name="bordered-radio"
              onChange={(e) => updateFileds({visibility: 'private'})}
              checked={visibility =='private'}
            />
            <label
              htmlFor="privateVideo"
              className="w-full cursor-pointer py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Private
            </label>
          </div>
        </div>
      </div>
    </FormWrapper>
  );
};

export default VideoVisibiityForm;
