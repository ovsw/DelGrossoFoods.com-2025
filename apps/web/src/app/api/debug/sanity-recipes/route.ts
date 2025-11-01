import { sanityFetch } from "@/lib/sanity/live";
import { getAllRecipesForIndexQuery } from "@/lib/sanity/query";
import { handleErrors } from "@/utils";

export async function GET() {
  const [result, errorMessage] = await handleErrors(
    sanityFetch({
      query: getAllRecipesForIndexQuery,
    }),
  );

  if (errorMessage) {
    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }

  return Response.json({
    success: true,
    data: result?.data || [],
    count: result?.data?.length || 0,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return Response.json({
        success: false,
        error: "Slug parameter required",
      });
    }

    const [result, errorMessage] = await handleErrors(
      sanityFetch({
        query: `
          *[
            _type == "recipe"
            && slug.current == $slug
          ][0]{
            _id,
            name,
            "slug": slug.current
          }
        `,
        params: { slug },
      }),
    );

    if (errorMessage) {
      return Response.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: 500 },
      );
    }

    return Response.json({
      success: true,
      data: result?.data || null,
      slug,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
