import React from "react";
import { cross } from "@/../public/icons";
import Image from "next/image";
interface uploadProps {}

const upload: React.FC<uploadProps> = ({}) => {
  // uploadArea.addEventListener('dragover', (event) => {
  //   event.preventDefault();
  //   uploadArea.classList.add('dragover');
  // });

  // uploadArea.addEventListener('dragleave', (event) => {
  //   event.preventDefault();
  //   uploadArea.classList.remove('dragover');
  // });

  // uploadArea.addEventListener('drop', (event) => {
  //   event.preventDefault();
  //   uploadArea.classList.remove('dragover');
  //   var files = event.dataTransfer.files;
  //   input.files = files;
  //   if(files.length > 1) {
  //     fileName.innerHTML = files.length + "files";
  //   } else {
  //     fileName.innerHTML = files[0].name;
  //   }
  // });
  return (
    <div className="flex min-h-screen items-center bg-gradient-to-br dark:from-slate-100 dark:to-slate-200 from-slate-700 to-slate-900 ">
      <div className="mx-auto  flex flex-col rounded-md overflow-hidden bg-white w-[95vw] max-w-3xl border border-slate-100 shadow-sm ">
        <div className="w-full border-b flex justify-between items-center bg-white">
          <p className="text-xl font-bold text-slate-800 p-4 ">
            Upload a video
          </p>
          <div className=" rounded-full bg-gray-100 p-1 mr-4">
            <svg
              className="w-5 h-5 text-gray-500"
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
            htmlFor="video_input_1"
            className="py-16  flex flex-col justify-center items-center space-y-4"
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Drag and drop</span> or Click
                here drop
              </p>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                MP4, WebM OR OGG (MAX. 100 MB)
              </p>
            </div>
            <div className="p-6 py-3  inline-flex bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg text-white">
              Browse
            </div>
          </label>
          <input
            type="file"
            id="video_input_1"
            hidden
            placeholder="Upload your Video"
          />
        </div>
      </div>
    </div>
  );
};

export default upload;
