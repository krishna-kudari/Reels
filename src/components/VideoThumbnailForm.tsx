import React, { useEffect, useState } from "react";
import FormWrapper from "./FormWrapper";
import Image from "next/image";

type VideoThumbnailFormProps = VideoThumbnailForm & {
  updateFields: (fields: Partial<VideoThumbnailForm>) => void;
};

type VideoThumbnailForm = {
  thumbnail: File | null;
};

const VideoThumbnailForm: React.FC<VideoThumbnailFormProps> = ({
  thumbnail,
  updateFields,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    if (thumbnail) {
      const imageUrl = URL.createObjectURL(thumbnail);
      setImageUrl(imageUrl);
      console.log(imageUrl);
    }
  }, [thumbnail]);

  function handleUpload(event: any) {
    const image = event.target.files[0];
    updateFields({ thumbnail: image });
  }

  return (
    <FormWrapper title="Thumbnail">
      <div className="px-4">
        <p className="text-sm font-medium text-gray-500 mb-8">
          Choose or upload an image that will show the video is about. <br /> A
          good miniature is one that stands out and attracts the attention of
          viewers.{" "}
          <a
            href="https://support.google.com/youtube/answer/12340300"
            className="text-indigo-500 text-base font-bold "
            target="_blank"
            rel="noopener"
          >
            Know more
          </a>
        </p>

        <div className="flex space-x-6  bg-white">
          <label
            htmlFor="thumbnail"
            className="bg-gray-50 dark:bg-gray-900 w-64 border-2 rounded-lg border-dashed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="w-full aspect-square object-contain opacity-60"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M19 2v3m0 3V5m0 0h3m-3 0h-3"
              />
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M13 2H5a3 3 0 0 0-3 3v10.5c0 .086.011.17.032.25A1 1 0 0 0 2 16v3a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-7a1 1 0 0 0-.032-.25A1 1 0 0 0 22 11.5V11h-2v.016c-4.297.139-7.4 1.174-9.58 2.623.826.293 1.75.71 2.656 1.256 1.399.84 2.821 2.02 3.778 3.583a1 1 0 1 1-1.706 1.044c-.736-1.203-1.878-2.178-3.102-2.913-1.222-.734-2.465-1.192-3.327-1.392a15.466 15.466 0 0 0-3.703-.386h-.022c-.348.005-.68.02-.994.045V5a1 1 0 0 1 1-1h8V2zM8.5 6a2.68 2.68 0 0 0-1.522.488C6.408 6.898 6 7.574 6 8.5c0 .926.408 1.601.978 2.011A2.674 2.674 0 0 0 8.5 11c.41 0 1.003-.115 1.522-.489.57-.41.978-1.085.978-2.011 0-.926-.408-1.601-.978-2.012A2.674 2.674 0 0 0 8.5 6z"
                clipRule="evenodd"
              />
            </svg>
            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              hidden
              required
              placeholder={"Browse"}
              onChange={handleUpload}
            />
          </label>
          {imageUrl && (
            <div className="relative w-64 border rounded-md overflow-hidden">
              <Image
                className="object-contain object-center aspect-square w-full h-full"
                fill
                src={`${imageUrl}`}
                alt={""}
              />
            </div>
          )}
        </div>
      </div>
    </FormWrapper>
  );
};

export default VideoThumbnailForm;
