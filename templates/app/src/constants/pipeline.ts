/**
 * Table page (CRUD) — Dreams ERP pipeline.html + dashboard data tables.
 * @see https://dreamserp.dreamstechnologies.com/tailwind/pipeline.html
 */

export type PipelineAccess = "all" | "selected";

export type PipelinePerson = {
  id: string;
  name: string;
};

export type PipelineStage = {
  id: string;
  name: string;
};

export type PipelineRow = {
  id: string;
  name: string;
  stages: PipelineStage[];
  deals: number;
  totalValue: string;
  created: string;
  status: "Active" | "Inactive";
  access: PipelineAccess;
  people: PipelinePerson[];
};

export const PIPELINE_PAGE = {
  header: {
    title: "Table",
    description:
      "CRUD data tables — create, edit, delete with shared dialogs (replaces the old CRUD demo).",
  },
  export: "Export",
  exportPdf: "Export as PDF",
  exportExcel: "Export as Excel",
  add: "Add Pipeline",
  filter: "Filter",
  columns: {
    name: "Pipeline Name",
    stages: "Stages",
    deals: "Deals",
    totalValue: "Total Value",
    created: "Created",
    status: "Status",
    action: "Action",
  },
  actions: {
    edit: "Edit",
    delete: "Delete",
  },
  form: {
    createTitle: "Create Pipeline",
    editTitle: "Edit Pipeline",
    id: "ID",
    name: "Pipeline Name",
    namePlaceholder: "Enter pipeline name",
    stages: "Pipeline Stages",
    addStage: "Add New",
    stagePlaceholder: "Stage name",
    access: "Access",
    accessAll: "All Person",
    accessSelected: "Selected",
    removePerson: "Remove",
    cancel: "Cancel",
    create: "Create New",
    save: "Save Changes",
    editStage: "Edit",
    deleteStage: "Delete",
  },
  delete: {
    title: "Delete Confirmation",
    description: "Are you sure, do you want to delete ?",
    confirm: "Yes, Delete",
    cancel: "Cancel",
  },
  toast: {
    created: "Pipeline created",
    updated: "Pipeline updated",
    deleted: "Pipeline deleted",
  },
  empty: {
    title: "No pipelines",
    description: "Create a pipeline to get started.",
  },
  performance: {
    title: "Performance Tracking",
    action: "View All",
    rows: [
      { name: "Sophie Moore", role: "Product Manager", score: "98", trend: "+2.4%" },
      { name: "Daniel Park", role: "Engineering Lead", score: "94", trend: "+1.1%" },
      { name: "Ava Brooks", role: "People Ops", score: "91", trend: "-0.6%" },
      { name: "Ethan Cole", role: "Sales Director", score: "89", trend: "+3.2%" },
    ],
  },
  payments: {
    title: "Recent Payments",
    action: "Full Report",
    headers: ["Job Title", "Category", "Location", "Openings", "Status"],
    rows: [
      {
        title: "Frontend Engineer",
        category: "Engineering",
        location: "Remote",
        openings: "3",
        status: "Open",
      },
      {
        title: "HR Business Partner",
        category: "People",
        location: "Austin, TX",
        openings: "1",
        status: "Interview",
      },
      {
        title: "Payroll Specialist",
        category: "Finance",
        location: "New York, NY",
        openings: "2",
        status: "Filled",
      },
      {
        title: "Sales Executive",
        category: "Sales",
        location: "Chicago, IL",
        openings: "4",
        status: "Open",
      },
    ],
  },
} as const;

export const PIPELINE_SEED: PipelineRow[] = [
  {
    id: "#PIP0016",
    name: "Enterprise Sales",
    stages: [
      { id: "s1", name: "Inpipeline" },
      { id: "s2", name: "Follow Up" },
      { id: "s3", name: "Schedule Service" },
      { id: "s4", name: "Proposal" },
      { id: "s5", name: "Won" },
    ],
    deals: 28,
    totalValue: "$845,000",
    created: "11 Sep 2025",
    status: "Active",
    access: "selected",
    people: [{ id: "u1", name: "Robert Cosper" }],
  },
  {
    id: "#PIP0017",
    name: "SMB Pipeline",
    stages: [
      { id: "s1", name: "Inpipeline" },
      { id: "s2", name: "Follow Up" },
      { id: "s3", name: "Schedule Service" },
      { id: "s4", name: "Closed" },
    ],
    deals: 52,
    totalValue: "$285,000",
    created: "05 Sep 2025",
    status: "Active",
    access: "all",
    people: [],
  },
  {
    id: "#PIP0018",
    name: "Channel Partners",
    stages: [
      { id: "s1", name: "Inpipeline" },
      { id: "s2", name: "Follow Up" },
      { id: "s3", name: "Schedule Service" },
      { id: "s4", name: "Negotiation" },
      { id: "s5", name: "Contract" },
      { id: "s6", name: "Won" },
    ],
    deals: 15,
    totalValue: "$420,000",
    created: "27 Aug 2025",
    status: "Active",
    access: "selected",
    people: [{ id: "u1", name: "Robert Cosper" }],
  },
  {
    id: "#PIP0019",
    name: "Renewal Pipeline",
    stages: [
      { id: "s1", name: "Inpipeline" },
      { id: "s2", name: "Follow Up" },
      { id: "s3", name: "Schedule Service" },
    ],
    deals: 42,
    totalValue: "$615,000",
    created: "16 Aug 2025",
    status: "Active",
    access: "all",
    people: [],
  },
  {
    id: "#PIP0020",
    name: "Upsell Pipeline",
    stages: [
      { id: "s1", name: "Inpipeline" },
      { id: "s2", name: "Follow Up" },
      { id: "s3", name: "Schedule Service" },
      { id: "s4", name: "Won" },
    ],
    deals: 18,
    totalValue: "$185,000",
    created: "25 Jul 2025",
    status: "Inactive",
    access: "selected",
    people: [{ id: "u1", name: "Robert Cosper" }],
  },
];

export const DEFAULT_PIPELINE_STAGES: PipelineStage[] = [
  { id: "s1", name: "Inpipeline" },
  { id: "s2", name: "Follow Up" },
  { id: "s3", name: "Schedule Service" },
];

export const DEFAULT_PIPELINE_PERSON: PipelinePerson = {
  id: "u1",
  name: "Robert Cosper",
};
