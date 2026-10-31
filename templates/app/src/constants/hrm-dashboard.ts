/**
 * HRM dashboard copy — visual structure from Dreams ERP HRM reference screenshot.
 */
export const HRM_DASHBOARD_PAGE = {
  header: {
    title: "Good morning, Andrew 👋",
    description: "You have 7 leave requests and 2 urgent alerts pending.",
  },
  export: "Export",
  addEmployee: "Add Employee",
  viewLogs: "View Logs",
  postJob: "Post New Job",
  downloadPayslip: "Download Payslip",
  runPayroll: {
    title: "Run Payroll",
    description: "Process Monthly Pay",
    action: "Run Payroll",
  },
  workforce: {
    title: "Total Workforce",
    value: "1,284",
    badge: "↗ 12 new this month",
    metrics: [
      {
        id: "leave",
        label: "On Leave Today",
        value: "23",
        trend: 3.64,
        icon: "leave",
        tint: "primary",
      },
      {
        id: "attendance",
        label: "Attendance Rate",
        value: "94.2%",
        trend: 3.64,
        icon: "attendance",
        tint: "orange",
      },
      {
        id: "positions",
        label: "Open Positions",
        value: "47",
        trend: 3.64,
        icon: "positions",
        tint: "violet",
      },
      {
        id: "payroll",
        label: "Monthly Payroll",
        value: "$1,248K",
        trend: 3.64,
        icon: "payroll",
        tint: "rose",
      },
    ],
  },
  distribution: {
    title: "Employee Distribution",
    total: "1,284",
    legend: [
      { label: "Engineering", value: 420, color: "#0284c7", className: "bg-primary" },
      { label: "Marketing", value: 210, color: "#f97316", className: "bg-orange-500" },
      { label: "Finance", value: 180, color: "#0ea5e9", className: "bg-sky-500" },
      { label: "Sales", value: 260, color: "#0369a1", className: "bg-sky-700" },
      { label: "HR", value: 214, color: "#075985", className: "bg-sky-800" },
    ],
    footer: [
      { label: "Active", value: "1196" },
      { label: "On Leave", value: "23" },
      { label: "Remote", value: "361" },
    ],
  },
  attendance: {
    title: "Attendance Summary",
    cells: [
      { label: "Present", value: "1209", hint: "89%" },
      { label: "Late", value: "78", hint: "5%" },
      { label: "Absent", value: "52", hint: "3%" },
      { label: "Remote", value: "361", hint: "24%" },
    ],
    trendTitle: "Weekly Attendance Trend",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [92, 88, 70, 95, 90, 45, 30],
    highlightIndex: 2,
  },
  payroll: {
    title: "Monthly Payroll",
    value: "$1,248K",
    stats: [
      { label: "Avg Salary", value: "$1,285.3K" },
      { label: "Last Month", value: "$1,196K" },
      { label: "MOM Growth", value: "4.2%" },
    ],
    chart: [980, 1020, 1100, 1080, 1198, 1248],
    chartLabel: "6-Month Payroll Trend",
  },
  recruitment: {
    title: "Recruitment Pipeline",
    stages: [
      { label: "New Applicants", value: "47", tint: "primary" },
      { label: "Screening", value: "23", tint: "orange" },
      { label: "Interviews", value: "12", tint: "violet" },
    ],
    candidatesTitle: "Recent Candidates",
    candidates: [
      { name: "Alex Thompson", role: "Senior Developer", status: "Interview" },
      { name: "Maria Garcia", role: "UX Designer", status: "Applied" },
      { name: "Thomas Marvin", role: "Senior Developer", status: "Offer Made" },
      { name: "Regina Bryant", role: "Android Developer", status: "Hired" },
    ],
  },
} as const;
