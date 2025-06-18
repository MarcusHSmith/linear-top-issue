import React from "react";
import ConnectLinearButton from "./ConnectLinearButton";

const NonLoggedInHome = () => (
  <div className="flex flex-col items-center">
    <ConnectLinearButton />
    <div className="w-full flex justify-center">
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/MJAmliXAGLg?start=60&autoplay=1"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
    <blockquote className="mt-8 px-6 py-4 border-l-4 border-gray-500 text-white max-w-xl text-lg italic bg-transparent">
      &quot;How do we find problems that are big enough where you would cancel
      the rest of your day to solve? And if you can find one of those, which is
      hard to find then it&apos;s worth devoting huge amounts of energy to
      solving that problem.&quot;
      <br />
      <a
        href="https://x.com/jeff_weinstein"
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-2 text-gray-400 font-semibold hover:underline"
      >
        @jeff_weinstein
      </a>
    </blockquote>
  </div>
);

export default NonLoggedInHome;
