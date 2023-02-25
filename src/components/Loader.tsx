import React, { useState } from "react";

interface LoaderProps {
  count: number;
  className: string;
}

const Loader: React.FC<LoaderProps> = ({ count, className}) => {
  const [arr, setArr] = useState(new Array(count).fill(1));
  return (
    <>
      {arr.map((_:number,index:number) => (
        <div key={index} className={className}>
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
