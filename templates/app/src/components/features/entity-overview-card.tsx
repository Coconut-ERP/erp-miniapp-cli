"use client";

import { Badge, Button, DashboardCard, Separator, StatisticCard } from "@erp/miniapp-ui";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { LIST_PAGE } from "@/constants/pages";
import type { SiteSummary } from "@/domain/types";

const TEAM_PREVIEW = 3;

export function EntityOverviewCard({ site }: { site: SiteSummary }) {
  const teams = site.teams.slice(0, TEAM_PREVIEW);
  const teamMore = site.teams.length - teams.length;
  const detailHref = `/sites/${site.id}`;

  return (
    <DashboardCard
      className="bg-card shadow-sm transition-shadow hover:shadow-md"
      title={site.name}
      description={LIST_PAGE.cardMeta}
      footer={
        <Button asChild size="sm" className="w-full gap-2">
          <Link href={detailHref}>
            {LIST_PAGE.cardHint}
            <ArrowRightIcon />
          </Link>
        </Button>
      }
    >
      <div className="grid grid-cols-3 gap-2">
        <StatisticCard
          label={LIST_PAGE.cardMetrics.teams}
          value={site.teamCount}
          className="bg-muted/40 shadow-none ring-1 ring-border/60 [&_[data-slot=card-title]]:text-2xl md:[&_[data-slot=card-title]]:text-2xl"
        />
        <StatisticCard
          label={LIST_PAGE.cardMetrics.members}
          value={site.memberCount}
          className="bg-muted/40 shadow-none ring-1 ring-border/60 [&_[data-slot=card-title]]:text-2xl md:[&_[data-slot=card-title]]:text-2xl"
        />
        <StatisticCard
          label={LIST_PAGE.cardMetrics.score}
          value={site.avgScore}
          className="bg-primary/10 shadow-none ring-1 ring-primary/20 [&_[data-slot=card-title]]:text-2xl md:[&_[data-slot=card-title]]:text-2xl"
        />
      </div>

      <Separator className="my-4" />

      <section className="space-y-2">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {LIST_PAGE.teamsLabel}
        </p>
        {teams.length === 0 ? (
          <p className="text-sm text-muted-foreground">{LIST_PAGE.noTeams}</p>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5">
            {teams.map((team) => (
              <Badge key={team.id} variant="secondary" className="font-medium">
                {team.name}
              </Badge>
            ))}
            {teamMore > 0 ? (
              <Badge variant="outline" asChild>
                <Link href={detailHref}>{LIST_PAGE.moreTeams(teamMore)}</Link>
              </Badge>
            ) : null}
          </div>
        )}
      </section>
    </DashboardCard>
  );
}
