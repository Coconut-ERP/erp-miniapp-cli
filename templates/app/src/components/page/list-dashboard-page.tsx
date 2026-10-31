"use client";

import {
  EmptyState,
  ErrorState,
  LoadingRows,
  PageHeader,
  SearchField,
  StatisticCard,
} from "@erp/miniapp-ui";
import { LayoutGridIcon, UsersIcon, WarehouseIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { EntityOverviewCard } from "@/components/features/entity-overview-card";
import { LIST_PAGE } from "@/constants/pages";
import { useSites } from "@/hooks/use-sites";

export function ListDashboardPage() {
  const { data, isLoading, error, refetch } = useSites();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((site) => {
      if (site.name.toLowerCase().includes(q)) return true;
      return site.teams.some((team) => team.name.toLowerCase().includes(q));
    });
  }, [data?.items, query]);

  if (isLoading) {
    return (
      <>
        <PageHeader {...LIST_PAGE.header} className="[&_h1]:text-2xl" />
        <LoadingRows rows={4} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader {...LIST_PAGE.header} className="[&_h1]:text-2xl" />
        <ErrorState title={LIST_PAGE.errorTitle} error={error} onRetry={() => void refetch()} />
      </>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <>
        <PageHeader {...LIST_PAGE.header} className="[&_h1]:text-2xl" />
        <EmptyState {...LIST_PAGE.empty} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        {...LIST_PAGE.header}
        className="[&_h1]:text-2xl"
        actions={
          <SearchField
            className="w-full sm:w-64"
            placeholder={LIST_PAGE.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatisticCard
          label={LIST_PAGE.stats.activeSites}
          value={data.activeCount}
          hint={LIST_PAGE.stats.activeHint}
          icon={<LayoutGridIcon />}
          className="bg-primary/10 ring-primary/20"
        />
        <StatisticCard
          label={LIST_PAGE.stats.totalTeams}
          value={data.totalTeams}
          hint={LIST_PAGE.stats.teamsHint}
          icon={<WarehouseIcon />}
          className="bg-secondary ring-border"
        />
        <StatisticCard
          label={LIST_PAGE.stats.totalMembers}
          value={data.totalMembers}
          hint={LIST_PAGE.stats.membersHint}
          icon={<UsersIcon />}
          className="bg-warning/10 ring-warning/20"
        />
      </div>

      <div className="space-y-4">
        <PageHeader
          title={LIST_PAGE.listTitle}
          description={LIST_PAGE.listDescription}
          className="[&_h1]:text-base"
        />
        {filtered.length === 0 ? (
          <EmptyState
            title={LIST_PAGE.empty.title}
            description={`No match for “${query.trim()}”.`}
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filtered.map((site) => (
              <EntityOverviewCard key={site.id} site={site} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
