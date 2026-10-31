import { expect, test } from "bun:test";
import type { ServiceRequestInput } from "@/domain/types";
import { HttpError } from "./errors";
import { createServiceRequest } from "./service-requests";

const valid = {
  requestType: "access",
  startDate: "2026-01-05",
  endDate: "2026-01-06",
  acceptPolicy: true,
} as unknown as ServiceRequestInput;

test("rejects a request that has not accepted the policy", async () => {
  const error = await createServiceRequest({ ...valid, acceptPolicy: false }).catch((e) => e);
  expect(error).toBeInstanceOf(HttpError);
  expect(error.status).toBe(400);
});

test("rejects an end date before the start date", async () => {
  const error = await createServiceRequest({ ...valid, endDate: "2026-01-01" }).catch((e) => e);
  expect(error.status).toBe(400);
});

test("returns a reference for a valid request", async () => {
  const result = await createServiceRequest(valid);
  expect(result.reference).toStartWith("REQ-");
  expect(result.id).toBe(result.reference.toLowerCase());
});
