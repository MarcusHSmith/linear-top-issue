import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <Link
        href="/"
        className="flex items-center gap-3 mb-6 mt-2 hover:opacity-80 transition-opacity"
      >
        <Image
          src="/images/logo-white.png"
          alt="Linear Top Issue Logo"
          width={40}
          height={40}
          priority
        />
        <span className="text-2xl font-bold tracking-wide select-none">
          Linear Top Issue
        </span>
      </Link>
      <h1 className="text-3xl font-bold mb-4">About</h1>
      <div className="mb-8 max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          How the Top Issue is Found
        </h2>
        <div className="space-y-4 text-left">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </span>
            <p className="text-gray-300">
              Look for the highest priority in-progress initiatives in your{" "}
              <a
                href="https://linear.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Linear
              </a>{" "}
              workspace
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </span>
            <p className="text-gray-300">
              Find the highest priority projects from those initiatives, or if
              no initiatives exist, find the highest priority projects from your
              workspace
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </span>
            <p className="text-gray-300">
              Within those projects, identify the most important planned issues
              based on priority and other factors
            </p>
          </div>
        </div>
      </div>
      <p className="mb-6 text-lg text-center max-w-xl">
        This project was created by Marcus Smith
      </p>
      <div className="flex flex-col gap-4 items-center">
        <a
          href="https://twitter.com/marcusmth"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          @marcusmth
        </a>
        <a
          href="https://www.marcusmth.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          marcusmth.com
        </a>
      </div>
    </main>
  );
}
