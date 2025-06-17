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

  // TODO filter by status
  const initiativesQuery = await graphQLClient
    .rawRequest(
      `
  query Initiatives {
    initiatives {
      nodes {
        icon
        id
        name
        projects {
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

  const issuesQuery = await graphQLClient
    .rawRequest(
      `
    query Projects($projectIds: [ID!]!) {
      projects(filter: {id: {in: $projectIds}}) {
        nodes {
          issues(first: 10) {
            nodes {
              id
              title
              assignee {
                name
                id
                displayName
                statusLabel
              }
            }
          }
        }
      }
    }
    `,
      { projectIds }
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log("GET /api/linear/top-issue issuesQuery :: err", err);
      return err;
    });

  return issuesQuery;
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

  const issueQuery = await graphQLClient.rawRequest(
    `
    query Issue($issueId: String!) {
      issue(id: $issueId) {
        id,
        project {
          name
          id
          slugId
          initiatives {
            nodes {
              name
              id
              slugId
            }
          }
        }
      }
    }
    `,
    { issueId }
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
    const initiatives = await client.initiatives({ first: 10 });
    console.log("GET /api/linear/top-issue :: initiatives", initiatives);

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

    const teams = await getTeams(client);
    console.log(
      "GET /api/linear/top-issue :: teams",
      JSON.stringify(teams, null, 2)
    );

    // For now, just return the first initiative as the 'top issue'
    const topIssue = initiatives.nodes[0] || null;

    console.log(
      "GET /api/linear/top-issue :: topIssue",
      JSON.stringify(topIssue, null, 2)
    );

    const detailsFromIssue = await getDetailsFromIssue({
      client,
      issueId: topIssue.id,
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
