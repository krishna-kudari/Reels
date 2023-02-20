import React, { useState } from "react";

interface LoaderProps {
  count: number;
}

const Loader: React.FC<LoaderProps> = ({ count }) => {
  const [arr, setArr] = useState(new Array(count).fill(1));
  return (
    <>
      {arr.map((_:number,index:number) => (
        <div key={index} className="animate-pulse bg-slate-50 border relative border-gray-100 shadow rounded-3xl max-w-sm min-h-[90vh] mt-[5vh] w-full mx-auto mb-6">
          <div className="animate-pulse flex px-4 space-x-4 w-full absolute bottom-4">
            <div className="flex-grow-0  rounded-full bg-slate-200 h-12 w-12"></div>
            <div className="flex-grow space-y-2">
              <div className="h-4  bg-slate-200 rounded-xl"></div>
              <div className="h-6 w-24 rounded bg-slate-300"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Loader;
