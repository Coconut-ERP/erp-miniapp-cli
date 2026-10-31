import type { SiteDetail, SitesResponse } from "@/domain/types";
import { notFound } from "./errors";
import { SEED_SITE_DETAILS, SEED_SITES } from "./seed";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function listSites(): Promise<SitesResponse> {
  await delay(200);
  return SEED_SITES;
}

export async function getSite(id: string): Promise<SiteDetail> {
  await delay(180);
  const site = SEED_SITE_DETAILS[id];
  if (!site) throw notFound("Site not found");
  return site;
}
