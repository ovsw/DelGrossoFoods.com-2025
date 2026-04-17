import {
  buildFormsparkPayload,
  CONTACT_SUBMISSION_VALIDATION_MESSAGES,
  generateReferenceId,
  normalizeContactFormPayload,
} from "@/lib/contact-submission";

export const runtime = "nodejs";

const FORMSPARK_URL =
  process.env.FORMSPARK_URL ?? process.env.NEXT_PUBLIC_FORMSPARK_URL;
const SUBJECT_LABEL = "La Famiglia DelGrosso Contact Submission";
const GENERIC_ERROR_MESSAGE =
  "Sorry, there was an error sending your message. Please try again.";

export async function POST(request: Request): Promise<Response> {
  if (!FORMSPARK_URL) {
    return Response.json(
      {
        ok: false,
        message: "Form service is not configured.",
      },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const payload = normalizeContactFormPayload(body);
    const referenceId = generateReferenceId();
    const formsparkResponse = await fetch(FORMSPARK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(
        buildFormsparkPayload(payload, referenceId, SUBJECT_LABEL),
      ),
      cache: "no-store",
    });

    if (!formsparkResponse.ok) {
      console.error("Formspark submission failed", {
        status: formsparkResponse.status,
        statusText: formsparkResponse.statusText,
      });

      return Response.json(
        {
          ok: false,
          message: GENERIC_ERROR_MESSAGE,
        },
        { status: 502 },
      );
    }

    return Response.json({
      ok: true,
      referenceId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : GENERIC_ERROR_MESSAGE;
    const status = CONTACT_SUBMISSION_VALIDATION_MESSAGES.has(message)
      ? 400
      : 500;

    if (status === 500) {
      console.error("Contact submission route failed", error);
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
