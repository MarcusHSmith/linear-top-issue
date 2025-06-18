import React from "react";

const ConnectLinearButton = () => (
  <a
    href="/api/auth/linear"
    className="mb-8 flex flex-col items-center px-8 py-3 rounded-full bg-black text-white font-bold text-lg shadow-lg hover:bg-neutral-900 transition-colors border border-white border-opacity-10"
    style={{ letterSpacing: 1, textDecoration: "none" }}
  >
    <span className="text-lg font-bold">Discover your top Issue</span>
    <span className="text-sm font-medium text-gray-400 mt-1">
      Connect Linear
    </span>
  </a>
);

export default ConnectLinearButton;
