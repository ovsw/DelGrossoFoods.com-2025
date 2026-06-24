import {
  getConstantContactAccessToken,
  NEWSLETTER_SUBMISSION_VALIDATION_MESSAGES,
  normalizeNewsletterPayload,
  submitNewsletterSignup,
} from "@/lib/newsletter-submission";

export const runtime = "nodejs";

const CLIENT_ID = process.env.CONSTANT_CONTACT_CLIENT_ID;
const CLIENT_SECRET = process.env.CONSTANT_CONTACT_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.CONSTANT_CONTACT_REFRESH_TOKEN;
const LIST_ID = process.env.CONSTANT_CONTACT_LIST_ID;
const GENERIC_ERROR_MESSAGE =
  "Sorry, there was an error subscribing. Please try again.";

export async function POST(request: Request): Promise<Response> {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN || !LIST_ID) {
    return Response.json(
      {
        ok: false,
        message: "Newsletter service is not configured.",
      },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const payload = normalizeNewsletterPayload(body);
    const accessToken = await getConstantContactAccessToken({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
    });

    await submitNewsletterSignup({
      accessToken,
      email: payload.email,
      listId: LIST_ID,
    });

    return Response.json({
      ok: true,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : GENERIC_ERROR_MESSAGE;
    const status = NEWSLETTER_SUBMISSION_VALIDATION_MESSAGES.has(message)
      ? 400
      : 500;

    if (status === 500) {
      console.error("Newsletter submission route failed", error);
    }

    return Response.json(
      {
        ok: false,
        message: status === 400 ? message : GENERIC_ERROR_MESSAGE,
      },
      { status },
    );
  }
}
