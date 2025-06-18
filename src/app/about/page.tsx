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
          href="https://marcusmth.com"
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
