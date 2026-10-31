export type TeamPreview = { id: string; name: string };

export type SiteSummary = {
  id: string;
  name: string;
  teamCount: number;
  memberCount: number;
  avgScore: number;
  teams: TeamPreview[];
};

export type SitesResponse = {
  items: SiteSummary[];
  activeCount: number;
  totalTeams: number;
  totalMembers: number;
};

export type AssignmentRow = {
  assignmentId: string;
  projectName: string | null;
  projectCode: string | null;
  hours: number | null;
};

export type MemberRow = {
  id: string;
  name: string;
  role: string;
  score: number | null;
  assignments: AssignmentRow[];
};

export type TeamDetail = {
  id: string;
  name: string;
  members: MemberRow[];
};

export type SiteDetail = {
  id: string;
  name: string;
  teamCount: number;
  teams: TeamDetail[];
};

export type RequestType = "access" | "incident" | "change";

export type RequestPriority = "low" | "normal" | "high" | "critical";

export type IncidentSeverity = "minor" | "major" | "outage";

export type ServiceRequestFormOptions = {
  departments: { id: string; label: string }[];
  requestTypes: { id: RequestType; label: string; hint: string }[];
  severities: { id: IncidentSeverity; label: string }[];
  notifyOptions: { id: string; label: string }[];
};

export type ServiceRequestInput = {
  requestType: RequestType;
  title: string;
  description: string;
  departmentId: string;
  priority: RequestPriority;
  startDate: string;
  endDate: string;
  urgent: boolean;
  severity: IncidentSeverity | null;
  notifyIds: string[];
  referenceId: string;
  acceptPolicy: boolean;
};

export type ServiceRequestResult = { id: string; reference: string };
