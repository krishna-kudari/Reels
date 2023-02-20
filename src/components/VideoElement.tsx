import { DocumentData } from "firebase/firestore";
import React, { MutableRefObject } from "react";
// const one = require('@/../public/reels/one.mp4');
interface VideoElementProps {
  post:DocumentData & {id: string};
  // ref: MutableRefObject<undefined> | null;
}

const VideoElement: React.FC<VideoElementProps> = ({}) => {

  return (
    <div className="h-full ">
      <video
        className="max-h-[90vh] object-cover object-center border border-gray-200 rounded-lg dark:border-gray-700"
        controls
      >
        <source src="/reels/one.mp4" type="video/mp4" />
        <source src="/reels/one.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoElement;
