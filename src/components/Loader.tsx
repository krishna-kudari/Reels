import React from "react";

interface LoaderProps {}

const Loader: React.FC<LoaderProps> = ({}) => {
  return (
    <div className="border relative border-gray-100 shadow rounded-3xl max-w-sm min-h-[90vh] mt-[5vh] w-full mx-auto">
      <div className="animate-pulse flex px-4 space-x-4 w-full absolute bottom-4">
        <div className="flex-grow-0  rounded-full bg-slate-200 h-12 w-12"></div>
        <div className="flex-grow space-y-2">
          <div className="h-4  bg-slate-200 rounded-xl"></div>
          <div className="h-6 w-24 rounded bg-slate-300"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
