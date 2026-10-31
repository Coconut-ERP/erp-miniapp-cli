import type { NextRequest } from "next/server";
import type { ServiceRequestInput } from "@/domain/types";
import { withApi } from "@/lib/api/route";
import { createServiceRequest } from "@/lib/api/service-requests";

export const dynamic = "force-dynamic";

export const POST = withApi(async (request: NextRequest) => {
  const body = (await request.json()) as ServiceRequestInput;
  return createServiceRequest(body);
});
