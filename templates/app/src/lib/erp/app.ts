import { createMiniApp, type ErpClient, type RequiredPermission } from "erp-sdk";
import { type AppObjects, resolveObjects } from "@/lib/erp/provision";

export interface AppErp {
  app: ErpClient;
  objects: AppObjects;
}

/**
 * Permissions required to serve a request. Boot fails fast if the key is missing
 * any of them. Schema rights (`object:create`, `object:field:create`) are absent
 * on purpose — a mini app never has them; tables come from `schema.json` applied
 * by the deployer.
 */
const PERMISSIONS: RequiredPermission[] = [
  { resource: "object", action: "read" },
  { resource: "object:field", action: "read" },
  { resource: "object:record", action: "read" },
  { resource: "object:record", action: "create" },
  { resource: "object:record", action: "update" },
  // Add delete only when the app truly deletes records:
  // { resource: "object:record", action: "delete" },
];

let booting: Promise<AppErp> | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing env ${name}. The platform injects it on mini-app deploy; for local dev set it in .env.local.`,
    );
  }
  return value;
}

async function boot(): Promise<AppErp> {
  const app = await createMiniApp({
    baseUrl: requireEnv("ERP_BASE_URL"),
    apiKey: requireEnv("ERP_API_KEY"),
    permissions: PERMISSIONS,
  });

  return { app, objects: await resolveObjects(app) };
}

/**
 * One ERP client per process, created on the first request. A failed boot is
 * not memoised, so a transient ERP outage does not poison the container.
 */
export function getErp(): Promise<AppErp> {
  if (!booting) {
    booting = boot().catch((error: unknown) => {
      booting = null;
      throw error;
    });
  }
  return booting;
}
