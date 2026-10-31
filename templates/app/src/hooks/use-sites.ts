import { useQuery } from "@tanstack/react-query";
import type { SiteDetail, SitesResponse } from "@/domain/types";
import { api } from "@/lib/client/api";

export function useSites() {
  return useQuery({
    queryKey: ["sites"],
    queryFn: () => api<SitesResponse>("/api/sites"),
  });
}

export function useSite(id: string) {
  return useQuery({
    queryKey: ["sites", id],
    queryFn: () => api<SiteDetail>(`/api/sites/${id}`),
    enabled: Boolean(id),
  });
}
