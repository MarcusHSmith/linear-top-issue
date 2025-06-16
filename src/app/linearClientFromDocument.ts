import { LinearClient } from "@linear/sdk";

export async function getLinearClientFromDocument(): Promise<LinearClient | null> {
  console.log("getLinearClientFromDocument ::");
  console.log(
    "getLinearClientFromDocument :: document.cookie",
    document.cookie
  );
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("linear_access_token="))
    ?.split("=")[1];

  console.log("getLinearClientFromDocument :: token", token);

  if (token) {
    try {
      return new LinearClient({ accessToken: token });
    } catch {
      return null;
    }
  }
  return null;
}

export async function getProjects() {
  console.log("getProjects ::");
  const client = await getLinearClientFromDocument();
  console.log("getProjects :: client", client);
  if (!client) {
    console.log("getProjects :: no client");
    return [];
  }
  const projects = await client.projects({ first: 50 });
  console.log("getProjects :: projects", projects);
  return projects.nodes;
}
