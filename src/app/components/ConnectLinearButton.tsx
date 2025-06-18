import React from "react";
import Image from "next/image";

const ConnectLinearButton = () => (
  <a
    href="/api/auth/linear"
    className="mb-8 flex flex-row items-center px-8 py-3 rounded-full bg-black text-white font-bold text-lg shadow-lg hover:bg-neutral-900 transition-colors border border-white border-opacity-10"
    style={{ letterSpacing: 1, textDecoration: "none" }}
  >
    <Image
      src="/images/Linear-Brand-Assets/logo-light.svg"
      alt="Linear Logo"
      width={32}
      height={32}
      className="mr-4"
      priority
    />
    <span className="flex flex-col items-start justify-center">
      <span className="text-lg font-bold">Discover your top Issue</span>
      <span className="text-sm font-medium text-gray-400 mt-1">
        Connect Linear
      </span>
    </span>
  </a>
);

export default ConnectLinearButton;
