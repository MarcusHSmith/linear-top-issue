import { NextResponse } from "next/server";
import { LinearClient } from "@linear/sdk";
import { cookies } from "next/headers";

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
      console.log("GET /api/linear/top-issue team :: err", err);
      return err;
    });
  return teams;
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
      console.log("GET /api/linear/top-issue initiativesQuery :: err", err);
      return err;
    });

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
    console.log("initiative ++", initiative);
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
  console.log("getTopIssuesFromProjects :: projectIds", projectIds);
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
      console.log("GET /api/linear/top-issue issuesQuery :: err", err);
      return err;
    });

  console.log(
    "GET /api/linear/top-issue :: issuesQuery",
    JSON.stringify(issuesQuery, null, 2)
  );

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

  console.log("GET /api/linear/top-issue :: topIssueIds", topIssueIds);

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
      console.log("GET /api/linear/top-issue issueQuery :: err", err);
      return err;
    });

  console.log(
    "GET /api/linear/top-issue :: issueQuery",
    JSON.stringify(issueQuery, null, 2)
  );

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
          id,
          avatarUrl
          displayName
        }
        project {
          name
          id
          slugId
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
              slugId
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
      console.log("GET /api/linear/top-issue issueQuery :: err", err);
      return err;
    });

  console.log(
    "GET /api/linear/top-issue :: issueQuery",
    JSON.stringify(issueQuery, null, 2)
  );

  return issueQuery;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("linear_access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "No Linear access token found" },
      { status: 401 }
    );
  }

  try {
    const client = new LinearClient({ accessToken: token });

    const teams = await getTeams(client);
    console.log(
      "GET /api/linear/top-issue :: teams",
      JSON.stringify(teams, null, 2)
    );

    const topProjectIdsFromInitiatives = await getTopProjectsFromInitiatives({
      client,
    });
    console.log(
      "GET /api/linear/top-issue :: topProjectIdsFromInitiatives",
      JSON.stringify(topProjectIdsFromInitiatives, null, 2)
    );

    const topIssuesFromProjects = await getTopIssuesFromProjects({
      client,
      projectIds: topProjectIdsFromInitiatives,
    });
    console.log(
      "GET /api/linear/top-issue :: topIssuesFromProjects",
      JSON.stringify(topIssuesFromProjects, null, 2)
    );

    let targetIssueId = null;

    if (topIssuesFromProjects.length === 0) {
      const issuesWithoutContext = await getIssuesWithoutContext({ client });
      console.log(
        "GET /api/linear/top-issue :: issuesWithoutContext",
        JSON.stringify(issuesWithoutContext, null, 2)
      );
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

    console.log("GET /api/linear/top-issue :: targetIssueId", targetIssueId);

    const detailsFromIssue = await getDetailsFromIssue({
      client,
      issueId: targetIssueId,
    });
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
