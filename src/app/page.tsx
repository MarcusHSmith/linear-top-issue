import { cookies } from "next/headers";
import WorkspaceSection from "./WorkspaceSection";

export default async function Home() {
  const cookieStore = await cookies();
  const workspaceName = cookieStore.get("linear_workspace_name")?.value || null;
  const workspaceUrl = cookieStore.get("linear_workspace_url")?.value || null;

  let user = null;
  try {
    console.log("GET /api/linear/get-user ::");
    console.log("GET /api/linear/get-user :: cookieStore", cookieStore);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/linear/get-user`,
      {
        headers: {
          Cookie: cookieStore
            .getAll()
            .map((c) => `${c.name}=${c.value}`)
            .join("; "),
        },
        cache: "no-store",
      }
    );
    if (res.ok) {
      console.log("GET /api/linear/get-user :: res.ok");
      const data = await res.json();
      console.log("GET /api/linear/get-user :: data", data);
      user = { name: data.name, avatarUrl: data.avatarUrl };
    } else {
      console.log("GET /api/linear/get-user :: res.ok", res.ok);
    }
  } catch (error) {
    console.log("GET /api/linear/get-user :: error", error);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center">
        {/* User info or Connect button */}
        {user ? (
          <WorkspaceSection
            user={user}
            workspaceName={workspaceName}
            workspaceUrl={workspaceUrl}
          />
        ) : (
          <a
            href="/api/auth/linear"
            className="mb-8 px-8 py-3 rounded-full bg-black text-white font-bold text-lg shadow-lg hover:bg-neutral-900 transition-colors border border-white border-opacity-10"
            style={{ letterSpacing: 1 }}
          >
            Connect Linear
          </a>
        )}
        {/* Add your custom content here */}
      </main>
    </div>
  );
}
