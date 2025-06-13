import { useEffect, useState } from "react";
import { LinearClient, Project } from "@linear/sdk";

export function useStartedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("linear_access_token="))
        ?.split("=")[1];
      if (!token) {
        setProjects([]);
        setLoading(false);
        return;
      }
      const client = new LinearClient({ accessToken: token });
      const allProjects = await client.projects();
      // Filter for status.type === 'started' (not completed)
      const startedProjects: Project[] = [];
      for (const project of allProjects.nodes) {
        // status is a LinearFetch, so we need to resolve it
        const status = await project.status;
        if (status && status.type === "started") {
          startedProjects.push(project);
        }
      }
      setProjects(startedProjects);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  return { projects, loading };
}
