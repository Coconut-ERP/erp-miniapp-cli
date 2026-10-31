import type { ServiceRequestFormOptions, SiteDetail, SitesResponse } from "@/domain/types";

/**
 * Demo seed — replace with ERP record reads in lib/api/* when wiring a workspace.
 * Keep seed data server-side only (import from lib/api, never from components).
 */
export const SEED_SITES: SitesResponse = {
  activeCount: 2,
  totalTeams: 5,
  totalMembers: 12,
  items: [
    {
      id: "site-a",
      name: "North Campus",
      teamCount: 3,
      memberCount: 7,
      avgScore: 4.2,
      teams: [
        { id: "team-a1", name: "Platform" },
        { id: "team-a2", name: "Support" },
        { id: "team-a3", name: "Ops" },
      ],
    },
    {
      id: "site-b",
      name: "South Hub",
      teamCount: 2,
      memberCount: 5,
      avgScore: 3.8,
      teams: [
        { id: "team-b1", name: "Delivery" },
        { id: "team-b2", name: "QA" },
      ],
    },
  ],
};

export const SEED_SITE_DETAILS: Record<string, SiteDetail> = {
  "site-a": {
    id: "site-a",
    name: "North Campus",
    teamCount: 3,
    teams: [
      {
        id: "team-a1",
        name: "Platform",
        members: [
          {
            id: "m1",
            name: "Ada Lovelace",
            role: "Lead",
            score: 4.8,
            assignments: [
              {
                assignmentId: "a1",
                projectName: "Portal refresh",
                projectCode: "PRJ-101",
                hours: 32,
              },
            ],
          },
          {
            id: "m2",
            name: "Grace Hopper",
            role: "Engineer",
            score: 4.5,
            assignments: [],
          },
        ],
      },
      {
        id: "team-a2",
        name: "Support",
        members: [
          {
            id: "m3",
            name: "Alan Turing",
            role: "Engineer",
            score: 4.1,
            assignments: [
              {
                assignmentId: "a2",
                projectName: "Helpdesk SLA",
                projectCode: "PRJ-204",
                hours: 20,
              },
              {
                assignmentId: "a3",
                projectName: "Docs migration",
                projectCode: "PRJ-205",
                hours: 8,
              },
            ],
          },
        ],
      },
      { id: "team-a3", name: "Ops", members: [] },
    ],
  },
  "site-b": {
    id: "site-b",
    name: "South Hub",
    teamCount: 2,
    teams: [
      {
        id: "team-b1",
        name: "Delivery",
        members: [
          {
            id: "m4",
            name: "Katherine Johnson",
            role: "Lead",
            score: 4.6,
            assignments: [],
          },
        ],
      },
      {
        id: "team-b2",
        name: "QA",
        members: [
          {
            id: "m5",
            name: "Margaret Hamilton",
            role: "Engineer",
            score: 4.9,
            assignments: [
              {
                assignmentId: "a4",
                projectName: "Release hardening",
                projectCode: "PRJ-310",
                hours: 40,
              },
            ],
          },
        ],
      },
    ],
  },
};

export const SEED_SERVICE_REQUEST_OPTIONS: ServiceRequestFormOptions = {
  departments: [
    { id: "eng", label: "Engineering" },
    { id: "ops", label: "Operations" },
    { id: "hr", label: "People & HR" },
    { id: "fin", label: "Finance" },
  ],
  requestTypes: [
    { id: "access", label: "Access", hint: "Accounts, roles, VPN" },
    { id: "incident", label: "Incident", hint: "Outage or service degradation" },
    { id: "change", label: "Change", hint: "Planned rollout or config change" },
  ],
  severities: [
    { id: "minor", label: "Minor — limited impact" },
    { id: "major", label: "Major — multiple teams affected" },
    { id: "outage", label: "Outage — production down" },
  ],
  notifyOptions: [
    { id: "owner", label: "Request owner" },
    { id: "oncall", label: "On-call rotation" },
    { id: "leadership", label: "Department lead" },
  ],
};
