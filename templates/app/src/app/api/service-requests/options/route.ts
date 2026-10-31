import { withApi } from "@/lib/api/route";
import { getServiceRequestOptions } from "@/lib/api/service-requests";

export const dynamic = "force-dynamic";

export const GET = withApi(async () => getServiceRequestOptions());
