import Image from "next/image";
import { cookies } from "next/headers";
import { LinearClient } from "@linear/sdk";

export default async function Home() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("linear_access_token");
  let user: { name: string; avatarUrl: string } | null = null;

  if (
    tokenCookie &&
    typeof tokenCookie.value === "string" &&
    tokenCookie.value
  ) {
    try {
      const client = new LinearClient({
        accessToken: tokenCookie.value as string,
      });
      console.log("client ::", client);
      const viewer = await client.viewer;
      console.log("viewer ::", viewer);
      user = { name: viewer.name, avatarUrl: viewer.avatarUrl ?? "" };
    } catch {
      user = null;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center">
        {/* User info or Connect button */}
        {user ? (
          <div className="flex items-center gap-4 mb-8">
            <Image
              src={user.avatarUrl}
              alt={user.name}
              width={48}
              height={48}
              className="rounded-full border border-white/20"
            />
            <span className="font-bold text-lg">{user.name}</span>
          </div>
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
