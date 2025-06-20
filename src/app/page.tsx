import { cookies } from "next/headers";
import WorkspaceSection from "./WorkspaceSection";
import Image from "next/image";
import NonLoggedInHome from "./components/NonLoggedInHome";
import { getLinearUser } from "@/utils/linear";

export default async function Home() {
  const cookieStore = await cookies();
  const workspaceName = cookieStore.get("linear_workspace_name")?.value || null;
  const workspaceUrl = cookieStore.get("linear_workspace_url")?.value || null;

  const linearUser = await getLinearUser(cookieStore);

  const user =
    linearUser && linearUser.avatarUrl
      ? { name: linearUser.name, avatarUrl: linearUser.avatarUrl }
      : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center w-full">
        <header className="flex items-center gap-3 mb-6 mt-2">
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
        </header>
        {user ? (
          <WorkspaceSection
            user={user}
            workspaceName={workspaceName}
            workspaceUrl={workspaceUrl}
          />
        ) : (
          <>
            <NonLoggedInHome />
          </>
        )}
      </main>
      <footer className="w-full flex justify-center mt-8">
        <a
          href="/about"
          className="text-neutral-400 hover:text-white text-sm underline underline-offset-2"
        >
          About
        </a>
      </footer>
    </div>
  );
}
