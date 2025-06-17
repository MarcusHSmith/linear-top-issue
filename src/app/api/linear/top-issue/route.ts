import { NextResponse } from "next/server";
import { LinearClient, LinearDocument } from "@linear/sdk";
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
}) {
  const graphQLClient = client.client;
  graphQLClient.setHeader("my-header", "value");

  // TODO filter by status
  const initiativesQuery = await graphQLClient
    .rawRequest(
      `
  query Initiatives() {
    initiatives() {
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
  return initiativesQuery;
}

async function getTopIssuesFromProjects({
  client,
  topProjects,
}: {
  client: LinearClient;
  topProjects: { id: string }[];
}) {
  const graphQLClient = client.client;
  graphQLClient.setHeader("my-header", "value");

  const issuesQuery = await graphQLClient
    .rawRequest(
      `
    query Projects($topProjects: [ID!]!) {
      projects(filter: {id: {in: $topProjects}}) {
        nodes {
          issues(orderBy: updatedAt) {
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
      { topProjects }
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

    const projects = await client.projects({
      first: 5,
      orderBy: LinearDocument.PaginationOrderBy.UpdatedAt,
    });
    console.log("GET /api/linear/top-issue :: projects", projects);

    const issues = await client.issues({ first: 2 });
    console.log("GET /api/linear/top-issue :: issues", issues);

    const currentCycle = await client.cycles({ first: 3 });
    console.log("GET /api/linear/top-issue :: currentCycle", currentCycle);

    const topProjectsFromInitiatives = await getTopProjectsFromInitiatives({
      client,
    });
    console.log(
      "GET /api/linear/top-issue :: topProjectsFromInitiatives",
      JSON.stringify(topProjectsFromInitiatives, null, 2)
    );

    const topIssuesFromProjects = await getTopIssuesFromProjects({
      client,
      topProjects: [
        {
          id: "123",
        },
      ],
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
    return NextResponse.json({ topIssue });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch top issue", details: (error as Error).message },
      { status: 500 }
    );
  }
}
