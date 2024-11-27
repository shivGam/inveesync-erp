import React from "react";

const Loading = ({title = "Loading..."}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl shadow-lg p-6">
      <div className="w-16 h-16 border-4 border-t-primary border-r-secondary border-b-gray-200 border-l-gray-200 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-medium text-gray-700">{title}</p>
    </div>
  );
};

export default Loading;
