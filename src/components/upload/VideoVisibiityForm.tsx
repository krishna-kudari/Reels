import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import CodeTextArea from "../codeTextarea";
import FormWrapper from "./FormWrapper";

type VideoVisibiityFormProps = VideoVisibiityForm & {
  updateFileds: (fields: Partial<VideoVisibiityForm>) => void;
};
type VideoVisibiityForm = {
  visibility: string;
  tags: Array<string>;
  code: string;
};

const VideoVisibiityForm: React.FC<VideoVisibiityFormProps> = ({
  visibility,
  tags,
  code,
  updateFileds,
}) => {
  function handleRemove(deleteindex: number) {
    const newTags = tags.filter((tag, index) => index != deleteindex);
    updateFileds({tags:newTags});
  }
  function handleClick(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && tag != "") {
      updateFileds({tags:[...tags,tag]});
      setTag("");
    }
  }
  function updateCode(code:string){
    updateFileds({code: code})
  }
  const [tag, setTag] = useState("");
  return (
    <FormWrapper title="Visibility">
      <div className=" w-full h-full px-8 space-y-6">
        <div className="flex space-x-6">
          <div
            className={`flex items-center px-4 border ${
              visibility == "public" && "bg-gray-200 dark:bg-gray-400"
            } border-gray-200 rounded dark:border-gray-400`}
          >
            <input
              id="publicVideo"
              type="radio"
              value=""
              name="bordered-radio"
              onChange={(e) => updateFileds({ visibility: "public" })}
              checked={visibility == "public"}
            />
            <label
              htmlFor="publicVideo"
              className={`w-full cursor-pointer py-4 ml-2 text-sm font-medium text-gray-900 ${
                visibility == "public"
                  ? " dark:text-gray-800"
                  : "dark:text-gray-200"
              }`}
            >
              Public
            </label>
          </div>
          <div
            className={`flex items-center px-4 border ${
              visibility == "private" && "bg-gray-200 dark:bg-gray-400"
            } border-gray-200 rounded dark:border-gray-400`}
          >
            <input
              id="privateVideo"
              type="radio"
              value=""
              name="bordered-radio"
              onChange={(e) => updateFileds({ visibility: "private" })}
              checked={visibility == "private"}
            />
            <label
              htmlFor="privateVideo"
              className={`w-full cursor-pointer py-4 ml-2 text-sm font-medium text-gray-900  ${
                visibility == "private"
                  ? " dark:text-gray-800"
                  : "dark:text-gray-200"
              }`}
            >
              Private
            </label>
          </div>
        </div>

        <div className="flex space-x-2 space-y-2 flex-wrap items-center dark:text-systemLbDark-400">
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyDown={handleClick}
            className="px-4 p-2 text-lg bg-transparent outline-none border rounded-full"
            name="tag"
            id="tag"
            placeholder="Add Tag... "
          />
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center space-x-1 border p-2 rounded-full "
            >
              <p>{tag}</p>
              <XMarkIcon
                onClick={() => handleRemove(index)}
                className="h-6 w-6 cursor-pointer"
              />
            </div>
          ))}
        </div>

        <CodeTextArea updateCode={updateCode} code={code}/>
      </div>
    </FormWrapper>
  );
};

export default VideoVisibiityForm;
