/**
 * Page copy — no React, no I/O. See docs/conventions/constants.md
 */
export const LIST_PAGE = {
  header: {
    title: "Sites",
    description: "Active locations with teams and members. Pick one for detail + nested table.",
  },
  errorTitle: "Could not load sites",
  empty: {
    title: "No sites yet",
    description: "Wire lib/api/sites.ts to ERP or extend lib/api/seed.ts for local demo.",
  },
  stats: {
    activeSites: "Active sites",
    totalTeams: "Total teams",
    totalMembers: "Total members",
    activeHint: "Sites in workspace",
    teamsHint: "Linked teams",
    membersHint: "All members across sites",
  },
  searchPlaceholder: "Search sites…",
  listTitle: "Site overview",
  listDescription: "Teams and headcount per site.",
  cardMeta: "Operations",
  cardMetrics: {
    teams: "Teams",
    members: "Members",
    score: "Avg score",
  },
  teamsLabel: "Teams",
  noTeams: "No teams linked",
  moreTeams: (count: number) => `+ ${count} teams`,
  cardHint: "View site detail",
} as const;

export const DETAIL_PAGE = {
  fallbackHeader: {
    title: "Site",
    description: "Teams and members",
  },
  errorTitle: "Could not load site",
  notFound: {
    title: "Site not found",
    description: "The record may have been removed.",
  },
  emptyTeams: {
    title: "No teams",
    description: "Link team records to this site in your workspace.",
  },
  emptyMembers: {
    title: "No members",
    description: "Add members to this team.",
  },
  assignCta: "New request",
  assignRow: "Request",
  backToList: "← All sites",
  description: (teamCount: number) => `${teamCount} teams · roster & assignments`,
  noAssignment: "Unassigned",
  columns: {
    member: "Member",
    role: "Role",
    score: "Score",
    project: "Project",
    code: "Code",
    hours: "Hours",
    action: "Action",
  },
} as const;

export const FORM_PAGE = {
  header: {
    title: "Service request",
    description:
      "Multi-step form template — validation, conditional fields, review step, and mutation.",
  },
  stepNavLabel: "Form steps",
  steps: {
    basics: "Basics",
    schedule: "Schedule",
    options: "Options",
    review: "Review",
  },
  sections: {
    basics: {
      title: "What do you need?",
      description: "Type, summary, and owning department.",
      legend: "Request details",
    },
    schedule: {
      title: "When & how urgent",
      description: "Priority, window, and escalation.",
    },
    options: {
      title: "Notifications & policy",
      description: "Conditional fields and optional metadata.",
    },
    advanced: {
      title: "Advanced (optional)",
    },
    review: {
      title: "Review & submit",
      description: "Confirm details before sending to your API route.",
    },
  },
  errorTitle: "Could not load form options",
  reviewErrorTitle: "Fix highlighted steps",
  labels: {
    requestType: "Request type",
    title: "Title",
    description: "Description",
    department: "Department",
    priority: "Priority",
    startDate: "Start date",
    endDate: "End date",
    urgent: "Escalate immediately",
    severity: "Incident severity",
    notify: "Notify",
    referenceId: "Reference ticket",
    acceptPolicy: "I accept the internal usage policy",
    window: "Window",
  },
  placeholders: {
    requestType: "Choose a type",
    title: "Short summary",
    description: "Context for reviewers…",
    department: "Choose department",
    severity: "Select severity",
    referenceId: "EXT-12345",
  },
  hints: {
    title: "At least 3 characters.",
    description: "At least 5 characters.",
    incidentDescription: "Incidents need at least 10 characters with impact details.",
    urgent: "Pages on-call and marks the request as expedited.",
    notify: "Select who receives status updates.",
    referenceId: "Link to an external tracker if you have one.",
  },
  priorityOptions: [
    { id: "low", label: "Low — best effort" },
    { id: "normal", label: "Normal — standard SLA" },
    { id: "high", label: "High — same week" },
    { id: "critical", label: "Critical — today" },
  ] as const,
  errors: {
    requestType: "Choose a request type.",
    title: "Title must be at least 3 characters.",
    description: "Add a bit more detail.",
    incidentDescription: "Describe impact for incidents (min 10 characters).",
    department: "Choose a department.",
    endDate: "End date must be on or after start date.",
    severity: "Select severity for incidents.",
    acceptPolicy: "Accept the policy to submit.",
  },
  badges: {
    urgent: "Urgent",
  },
  actions: {
    back: "Back",
    continue: "Continue",
    review: "Review",
    submit: "Submit request",
    submitting: "Submitting…",
  },
  toastSuccess: (reference: string) => `Request ${reference} submitted`,
  toastFixErrors: "Fix the highlighted fields before submitting.",
  toastFailure: "Submit failed",
} as const;

export const HUB_PAGE = {
  title: "Mini app starter",
  description:
    "Reference layout for @erp/miniapp-ui. Clone this example app — folder structure matches docs/conventions/folder.md.",
} as const;
