import { google_mark_colored, reels_mark_solid } from "public/assets";
import React from "react";
import Image from "next/image";
import { HomeIcon } from "@heroicons/react/24/solid";
import ThemeButton from "@/components/ThemeButton";
interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
  return (
    <div className="bg-gray-900 border-2 border-black  flex justify-between">
      <div
        className={`w-[calc(50%-230px)] rounded-br-3xl shadow-sm p-2 px-4 space-x-2 justify-between bg-gray-200 bg-opacity-20 backdrop-blur-sm flex items-center`}
      >
        <div className="flex space-x-1  ">
          <div className="relative  h-8 w-8 ">
            <Image
              src={reels_mark_solid}
              fill
              className="object-cover"
              alt={"🎬🎞️"}
            />
          </div>
          <p className="font-bold text-xl text-slate-900 ">reels</p>
        </div>
        <HomeIcon className="h-8 w-8  text-gray-900" />
      </div>

      <div
        className={`w-[calc(50%-178px)] rounded-bl-3xl shadow-sm  p-2 px-4 space-x-2 justify-between bg-slate-800 bg-opacity-20 backdrop-blur-sm flex items-center`}
      > 
      <div className="flex space-x-4 items-center ">
        <ThemeButton />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="w-10 h-10 cursor-pointer rounded-full hover:scale-105 transition-all duration-300 ease-in-out  text-[rgb(50,215,75)] bg-slate-50 "
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

        <div className="flex space-x-1 items-center p-1 px-2 cursor-pointer rounded-xl hover:scale-105 transition-all duration-300 ease-in-out bg-white">
          <p className="font-semibold text-base ">IAmKRS</p>
          <div className="relative  h-8 w-8 rounded-lg ">
            <Image
              src={google_mark_colored}
              fill
              className="object-cover"
              alt={"🎬🎞️"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
