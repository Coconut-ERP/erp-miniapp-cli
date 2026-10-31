import { withApi } from "@/lib/api/route";
import { listSites } from "@/lib/api/sites";

export const dynamic = "force-dynamic";

export const GET = withApi(async () => listSites());
