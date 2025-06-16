import { NextResponse } from "next/server";
import { LinearClient, LinearDocument } from "@linear/sdk";
import { cookies } from "next/headers";

export async function GET() {
  console.log("GET /api/linear/top-issue ::");
  const cookieStore = await cookies();
  const token = cookieStore.get("linear_access_token")?.value;
  console.log("GET /api/linear/top-issue :: token", token);

  if (!token) {
    return NextResponse.json(
      { error: "No Linear access token found" },
      { status: 401 }
    );
  }

  try {
    const client = new LinearClient({ accessToken: token });
    console.log("GET /api/linear/top-issue :: client", client);
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
        console.log("GET /api/linear/top-issue team :: res", res.data);
        return res.data;
      })
      .catch((err) => {
        console.log("GET /api/linear/top-issue team :: err", err);
        return err;
      });
    console.log("GET /api/linear/top-issue :: teams", teams);

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
