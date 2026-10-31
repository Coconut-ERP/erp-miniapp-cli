import type {
  ServiceRequestFormOptions,
  ServiceRequestInput,
  ServiceRequestResult,
} from "@/domain/types";
import { badRequest } from "./errors";
import { SEED_SERVICE_REQUEST_OPTIONS } from "./seed";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getServiceRequestOptions(): Promise<ServiceRequestFormOptions> {
  await delay(150);
  return SEED_SERVICE_REQUEST_OPTIONS;
}

export async function createServiceRequest(
  input: ServiceRequestInput,
): Promise<ServiceRequestResult> {
  await delay(400);

  if (!input.acceptPolicy) {
    throw badRequest("Accept the usage policy to continue.");
  }
  if (input.requestType === "incident" && !input.severity) {
    throw badRequest("Incident requests require a severity level.");
  }
  if (input.endDate < input.startDate) {
    throw badRequest("End date must be on or after the start date.");
  }

  const reference = `REQ-${Date.now().toString(36).toUpperCase()}`;
  return { id: reference.toLowerCase(), reference };
}
