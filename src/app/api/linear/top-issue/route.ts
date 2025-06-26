import { NextResponse } from "next/server";
import { LinearClient } from "@linear/sdk";
import { cookies } from "next/headers";
import { storeUsers } from "@/utils/supabaseClient";

async function getTeams(client: LinearClient) {
  const graphQLClient = client.client;
  graphQLClient.setHeader("my-header", "value");

  const teams = await graphQLClient
    .rawRequest(
      `
        query Teams {
          teams {
            nodes {
              id
              name
              members {
                nodes {
                  id
                  email
                  name
                  displayName
                  avatarUrl
                  url
                }
              }
            }
          }
        }
  `,
      {}
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error("getTeams error", err);
      return null;
    });
  if (!teams) {
    return null;
  }
  return teams as {
    teams: {
      nodes: {
        id: string;
        name: string;
        members: {
          nodes: {
            id: string;
            email: string;
            displayName: string;
            avatarUrl: string;
            url: string;
          }[];
        };
      }[];
    };
  };
}

async function getTopProjectsFromInitiatives({
  client,
}: {
  client: LinearClient;
}): Promise<string[]> {
  const graphQLClient = client.client;
  graphQLClient.setHeader("my-header", "value");

  const initiativesQuery = await graphQLClient
    .rawRequest(
      `
    query Initiatives {
      initiatives(first: 3, orderBy: updatedAt, includeArchived: false, filter:  {
        status: {
          notContains: "Completed"
        }
      }) {
        nodes {
          icon
          id
          name
          projects(first: 3, includeArchived: false, sort: {
          status: {order: Ascending}
        }) {
            nodes {
              status {
                id
              }
              name
              id
            }
          }
        }
      }
    }
  `,
      {}
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error("getTopProjectsFromInitiatives error", err);
      return null;
    });

  if (!initiativesQuery) {
    return null;
  }

  const projectIds = (
    initiativesQuery as {
      initiatives: {
        nodes: Array<{
          id: string;
          projects: { nodes: Array<{ id: string }> };
        }>;
      };
    }
  ).initiatives?.nodes?.flatMap((initiative) => {
    return initiative.projects?.nodes?.map((project) => project.id);
  });

  return projectIds;
}

async function getTopIssuesFromProjects({
  client,
  projectIds,
}: {
  client: LinearClient;
  projectIds: string[];
}) {
  const graphQLClient = client.client;
  graphQLClient.setHeader("my-header", "value");

  // Conditionally build the filter string and variables
  const filterString =
    projectIds && projectIds.length > 0
      ? "filter: {id: {in: $projectIds}}, "
      : "";
  const variables = projectIds && projectIds.length > 0 ? { projectIds } : {};

  const query = `
    query Projects${
      projectIds && projectIds.length > 0 ? "($projectIds: [ID!]!)" : ""
    } {
      projects(first: 3, ${filterString}includeArchived: false, sort: {
        status: {order: Ascending}
      }) {
        nodes {
          name
          status {
            type
            position
            name
          }
          issues(first: 3, filter:  {
             state:  {
                type:  {
                   in: ["unstarted", "started"]
                }
             }
          }, orderBy: updatedAt) {
            nodes {
              id
              prioritySortOrder
            }
          }
        }
      }
    }
  `;

  const issuesQuery = await graphQLClient
    .rawRequest(query, variables)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error("getTopIssuesFromProjects error", err);
      return null;
    });

  if (!issuesQuery) {
    return [];
  }

  const topIssueIds = (
    issuesQuery as {
      projects: {
        nodes: Array<{
          issues: { nodes: Array<{ id: string; prioritySortOrder: number }> };
        }>;
      };
    }
  ).projects.nodes
    .sort((a, b) => b.issues.nodes.length - a.issues.nodes.length)
    .flatMap((project) => project.issues.nodes.map((issue) => issue.id));

  return topIssueIds;
}

async function getIssuesWithoutContext({ client }: { client: LinearClient }) {
  const graphQLClient = client.client;
  graphQLClient.setHeader("my-header", "value");

  const issueQuery = await graphQLClient
    .rawRequest(
      `
    query IssuesWithoutContext { 
      issues(first: 3, filter:  {
          state:  {
            type:  {
                in: ["unstarted", "started"]
            }
          }
      }, orderBy: updatedAt) {
        nodes {
          id,
          prioritySortOrder
        }
      }
    }
    `,
      {}
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error("getIssuesWithoutContext error", err);
      return null;
    });

  if (!issueQuery) {
    return [];
  }

  const sortedIssues = (
    issueQuery as {
      issues: { nodes: Array<{ id: string; prioritySortOrder: number }> };
    }
  ).issues.nodes
    .sort((a, b) => b.prioritySortOrder - a.prioritySortOrder)
    .map((issue) => issue.id);

  return sortedIssues;
}

async function getDetailsFromIssue({
  client,
  issueId,
}: {
  client: LinearClient;
  issueId: string;
}) {
  const graphQLClient = client.client;
  graphQLClient.setHeader("my-header", "value");

  const issueQuery = await graphQLClient
    .rawRequest(
      `
    query Issue($issueId: String!) {
      issue(id: $issueId) {
        id,
        url,
        title
        customerTicketCount
        priority
        prioritySortOrder
        state {
          name
          type
        }
        assignee {
          avatarUrl
          displayName
          url
        }
        project {
          name
          id
          icon
          url
          status {
            id,
            name
            type
            position
          }
          initiatives {
            nodes {
              name
              icon
              url
              id
              status
            }
          }
        }
      }
    }
    `,
      { issueId }
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error("getDetailsFromIssue error", err);
      return null;
    });

  if (!issueQuery) {
    return null;
  }
  return issueQuery;
}

export async function GET() {
  const cookieStore = await cookies();

  // Debug: Log all available cookies
  const allCookies = cookieStore.getAll();
  const token = cookieStore.get("linear_access_token")?.value;

  if (!token) {
    return NextResponse.json(
      {
        error: "No Linear access token found",
        debug: { availableCookies: allCookies.map((c) => c.name) },
      },
      { status: 401 }
    );
  }

  try {
    const client = new LinearClient({ accessToken: token });

    const teams = await getTeams(client);
    if (!teams) {
      console.error("Failed to fetch teams");
      return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
    }
    const usersToAdd = teams.teams.nodes.flatMap((team) => {
      return team.members.nodes.map((member) => {
        return {
          id: member.id,
          email: member.email,
          display_name: member.displayName,
          avatar_url: member.avatarUrl,
        };
      });
    });

    await storeUsers({
      users: usersToAdd,
    });

    const topProjectIdsFromInitiatives = await getTopProjectsFromInitiatives({
      client,
    });
    if (!topProjectIdsFromInitiatives) {
      console.error("Failed to fetch initiatives");
      return NextResponse.json({ error: "Failed to fetch initiatives" }, { status: 500 });
    }

    const topIssuesFromProjects = await getTopIssuesFromProjects({
      client,
      projectIds: topProjectIdsFromInitiatives,
    });
    if (!topIssuesFromProjects) {
      console.error("Failed to fetch project issues");
      return NextResponse.json({ error: "Failed to fetch project issues" }, { status: 500 });
    }

    let targetIssueId = null;

    if (topIssuesFromProjects.length === 0) {
      const issuesWithoutContext = await getIssuesWithoutContext({ client });
      if (!issuesWithoutContext) {
        console.error("Failed to fetch issues without context");
        return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 });
      }

      if (issuesWithoutContext.length > 0) {
        targetIssueId = issuesWithoutContext[0];
      } else {
        return NextResponse.json(
          { error: "No top issues found" },
          { status: 404 }
        );
      }
    } else {
      targetIssueId = topIssuesFromProjects[0];
    }

    const detailsFromIssue = await getDetailsFromIssue({
      client,
      issueId: targetIssueId,
    });
    if (!detailsFromIssue) {
      console.error("Failed to fetch issue details");
      return NextResponse.json({ error: "Failed to fetch issue details" }, { status: 500 });
    }
    console.log(
      "GET /api/linear/top-issue :: detailsFromIssue",
      JSON.stringify(detailsFromIssue, null, 2)
    );

    return NextResponse.json({ detailsFromIssue });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch top issue", details: (error as Error).message },
      { status: 500 }
    );
  }
}
