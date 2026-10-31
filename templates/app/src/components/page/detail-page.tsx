"use client";

import { Button, EmptyState, ErrorState, LoadingRows, PageHeader } from "@erp/miniapp-ui";
import Link from "next/link";
import { EntityMembersTable } from "@/components/features/entity-members-table";
import { DETAIL_PAGE } from "@/constants/pages";
import { useSite } from "@/hooks/use-sites";

export function DetailPage({ siteId }: { siteId: string }) {
  const { data, isLoading, error, refetch } = useSite(siteId);

  const assignAction = (
    <Button asChild>
      <Link href="/requests/new">{DETAIL_PAGE.assignCta}</Link>
    </Button>
  );

  if (isLoading) {
    return (
      <>
        <PageHeader {...DETAIL_PAGE.fallbackHeader} actions={assignAction} />
        <LoadingRows rows={5} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader {...DETAIL_PAGE.fallbackHeader} actions={assignAction} />
        <ErrorState title={DETAIL_PAGE.errorTitle} error={error} onRetry={() => void refetch()} />
      </>
    );
  }

  if (!data) {
    return (
      <>
        <PageHeader {...DETAIL_PAGE.fallbackHeader} actions={assignAction} />
        <EmptyState {...DETAIL_PAGE.notFound} />
      </>
    );
  }

  if (data.teams.length === 0) {
    return (
      <>
        <PageHeader
          title={data.name}
          description={DETAIL_PAGE.description(data.teamCount)}
          actions={assignAction}
        />
        <EmptyState {...DETAIL_PAGE.emptyTeams} />
        <Button variant="ghost" asChild>
          <Link href="/sites">{DETAIL_PAGE.backToList}</Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={data.name}
        description={DETAIL_PAGE.description(data.teamCount)}
        actions={assignAction}
      />

      {data.teams.map((team) => (
        <section key={team.id} className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold">{team.name}</h2>
            <p className="text-sm text-muted-foreground">{team.members.length} members</p>
          </div>
          <EntityMembersTable team={team} siteId={data.id} />
        </section>
      ))}

      <div>
        <Button variant="ghost" asChild>
          <Link href="/sites">{DETAIL_PAGE.backToList}</Link>
        </Button>
      </div>
    </>
  );
}
