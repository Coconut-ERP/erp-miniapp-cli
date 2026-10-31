import { ErpApiError, MissingPermissionsError, UnknownObjectError } from "erp-sdk";

export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const badRequest = (message: string) => new HttpError(400, message);
export const unauthorized = (message = "Session expired") => new HttpError(401, message);
export const notFound = (message = "Not found") => new HttpError(404, message);

function describe(error: unknown): { status: number; message: string } {
  if (error instanceof HttpError) return { status: error.status, message: error.message };

  if (error instanceof MissingPermissionsError) {
    const missing = error.missing.map((p) => `${p.resource}:${p.action}`).join(", ");
    return { status: 500, message: `App service account is missing permissions: ${missing}` };
  }

  if (error instanceof UnknownObjectError) {
    return { status: 500, message: `Object "${error.object}" is not created in the workspace yet` };
  }

  if (error instanceof ErpApiError) {
    return { status: error.status, message: error.message };
  }

  return {
    status: 500,
    message: error instanceof Error ? error.message : "Unknown error",
  };
}

export function errorResponse(error: unknown): Response {
  const { status, message } = describe(error);
  if (status >= 500) console.error("[api]", error);
  return Response.json({ error: message }, { status });
}
