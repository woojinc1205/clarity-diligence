// ============================================================
// CLARITY — Mock Data Store
// All data is simulated for UI demonstration purposes
// ============================================================

export type ConnectionStatus = "connected" | "pending" | "error" | "not_connected";

export interface DataSource {
  id: string;
  name: string;
  category: "database" | "crm" | "erp" | "hr" | "finance" | "analytics" | "custom";
  icon: string;
  status: ConnectionStatus;
  lastSync?: string;
  recordCount?: number;
  description: string;
}

export interface KPI {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  delta: number;
  deltaLabel: string;
  trend: "up" | "down" | "flat";
  positive: boolean; // whether up is good
  category: string;
  target?: string | number;
  insight?: string;
}

export interface ProcessNode {
  id: string;
  name: string;
  department: string;
  type: "start" | "process" | "decision" | "end";
  status: "optimal" | "warning" | "critical" | "opportunity";
  cost: number;
  headcount: number;
  cycleTime: number; // days
  automationRate: number; // 0-100
  nextNodes: string[];
  description: string;
  recommendation?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  area: string;
  processIds: string[];
  type: "automation" | "redesign" | "consolidation" | "elimination" | "optimization";
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  estimatedSaving: number;
  estimatedTimeToValue: string;
  description: string;
  nextSteps: string[];
  lever: string;
  baselineValue: number;
  targetValue: number;
  currentValue: number;
}

export interface GoalLever {
  id: string;
  name: string;
  description: string;
  category: string;
  currentValue: number;
  baselineValue: number;
  targetValue: number;
  unit: string;
  impact: string[];
}

export interface ReportSection {
  id: string;
  title: string;
  type: "summary" | "finding" | "opportunity" | "recommendation" | "roadmap";
  content: string;
  data?: unknown;
  priority: number;
}

// ---- DATA SOURCES ----
export const dataSources: DataSource[] = [
  { id: "ds1", name: "Salesforce CRM", category: "crm", icon: "cloud", status: "connected", lastSync: "4 minutes ago", recordCount: 48320, description: "Customer relationships, pipeline, and sales data" },
  { id: "ds2", name: "SAP ERP", category: "erp", icon: "layers", status: "connected", lastSync: "12 minutes ago", recordCount: 284100, description: "Core business processes, financials, and supply chain" },
  { id: "ds3", name: "Workday HCM", category: "hr", icon: "users", status: "connected", lastSync: "1 hour ago", recordCount: 3240, description: "Human capital management, payroll, and workforce data" },
  { id: "ds4", name: "QuickBooks", category: "finance", icon: "dollar-sign", status: "connected", lastSync: "2 hours ago", recordCount: 92400, description: "Accounting, invoicing, and financial reporting" },
  { id: "ds5", name: "Google Analytics", category: "analytics", icon: "bar-chart-2", status: "connected", lastSync: "30 minutes ago", recordCount: 1200000, description: "Web traffic, user behavior, and conversion data" },
  { id: "ds6", name: "PostgreSQL DB", category: "database", icon: "database", status: "connected", lastSync: "8 minutes ago", recordCount: 540000, description: "Primary operational database" },
  { id: "ds7", name: "HubSpot Marketing", category: "crm", icon: "mail", status: "pending", description: "Marketing automation and lead nurturing" },
  { id: "ds8", name: "Jira / Confluence", category: "custom", icon: "git-branch", status: "not_connected", description: "Project management and documentation" },
  { id: "ds9", name: "Slack", category: "custom", icon: "message-square", status: "not_connected", description: "Team communications and workflow signals" },
  { id: "ds10", name: "NetSuite", category: "erp", icon: "package", status: "error", description: "Cloud ERP for financials and operations" },
];

// ---- KPIs ----
export const kpis: KPI[] = [
  { id: "k1", label: "Process Efficiency", value: 73, unit: "%", delta: 4.2, deltaLabel: "vs last quarter", trend: "up", positive: true, category: "Operations", target: 85, insight: "Process efficiency has improved 4.2pp this quarter, driven by automation gains in Service Delivery. The gap to the 85% target is primarily in Proposal Generation (15%) and Contract Review (20%). Addressing these two nodes would close ~60% of the remaining gap." },
  { id: "k2", label: "Total Operating Cost", value: "$4.2M", unit: "", delta: -2.1, deltaLabel: "vs last quarter", trend: "down", positive: false, category: "Finance", target: "$3.5M", insight: "Operating costs declined 2.1% this quarter due to headcount optimization in Marketing. The largest cost drivers remain Engineering ($1.2M) and Operations ($850K). Automation opportunities in Proposal Generation and Onboarding could yield $445K in annual savings." },
  { id: "k3", label: "Headcount Utilization", value: 81, unit: "%", delta: 1.8, deltaLabel: "vs last quarter", trend: "up", positive: true, category: "HR", target: 88, insight: "Headcount utilization improved slightly but remains below the 88% target. Operations (68%) and Sales (74%) are the lowest-performing departments. Workflow consolidation in Onboarding could free 2.5 FTE equivalents." },
  { id: "k4", label: "Avg Cycle Time", value: 14.3, unit: "days", delta: -1.2, deltaLabel: "vs last quarter", trend: "down", positive: true, category: "Operations", target: 8, insight: "Average cycle time improved 1.2 days this quarter. The primary bottlenecks are Proposal Generation (7d) and Hire-to-Retire (45d). Automating proposal generation alone would reduce average cycle time by 3.2 days." },
  { id: "k5", label: "Revenue per Employee", value: "$128K", unit: "", delta: 6.4, deltaLabel: "vs last year", trend: "up", positive: true, category: "Finance", target: "$160K", insight: "Revenue per employee grew 6.4% year-over-year, outpacing the industry median of 4.1%. Reaching the $160K target requires either revenue growth of 25% or headcount reduction through automation — the opportunity analysis suggests automation is the more achievable path." },
  { id: "k6", label: "Automation Coverage", value: 38, unit: "%", delta: 5.0, deltaLabel: "vs last quarter", trend: "up", positive: true, category: "Technology", target: 65, insight: "Automation coverage increased 5pp this quarter, primarily from Revenue Recognition improvements. The largest automation gaps are in Proposal Generation (15%) and Contract Review (20%). Closing these would add 12pp to overall coverage." },
  { id: "k7", label: "Customer Satisfaction", value: 4.2, unit: "/5", delta: 0.3, deltaLabel: "vs last quarter", trend: "up", positive: true, category: "Customer", target: 4.7, insight: "Customer satisfaction improved 0.3 points this quarter. The primary driver of dissatisfaction in exit surveys is slow onboarding (cited by 62% of detractors). Consolidating onboarding workflows is projected to improve CSAT by 0.3-0.5 points." },
  { id: "k8", label: "Identified Opportunities", value: 12, unit: "", delta: 3, deltaLabel: "new this month", trend: "up", positive: true, category: "Strategy", target: 12, insight: "12 opportunities have been identified across 6 process areas, with a combined estimated annual savings of $1.18M. 3 are high-impact/low-effort (quick wins) and can be actioned within 60 days. The top opportunity — Automate Proposal Generation — alone represents $280K in annual savings." },
];

// ---- PROCESS NODES ----
export const processNodes: ProcessNode[] = [
  { id: "p1", name: "Lead Intake", department: "Sales", type: "start", status: "optimal", cost: 12000, headcount: 3, cycleTime: 1, automationRate: 65, nextNodes: ["p2", "p3"], description: "Initial lead capture from all channels", recommendation: "This process is performing well. Consider increasing automation coverage to 80%+ by integrating web form data directly into Salesforce without manual review." },
  { id: "p2", name: "Qualification", department: "Sales", type: "process", status: "warning", cost: 28000, headcount: 5, cycleTime: 3, automationRate: 30, nextNodes: ["p4"], description: "Lead scoring and qualification assessment", recommendation: "Implement AI-based lead scoring to reduce manual qualification effort. Current 30% automation rate is below the 60% benchmark. Estimated impact: reduce cycle time from 3d to 1d and free 2 FTE for higher-value activities." },
  { id: "p3", name: "Marketing Nurture", department: "Marketing", type: "process", status: "opportunity", cost: 18000, headcount: 2, cycleTime: 14, automationRate: 72, nextNodes: ["p4"], description: "Automated nurture sequences for unqualified leads", recommendation: "Expand nurture sequence personalization using behavioral data from Google Analytics. A/B test subject lines and send times to improve conversion rate from 12% to 18%." },
  { id: "p4", name: "Proposal Generation", department: "Sales", type: "process", status: "critical", cost: 45000, headcount: 8, cycleTime: 7, automationRate: 15, nextNodes: ["p5"], description: "Custom proposal creation and pricing", recommendation: "CRITICAL: Implement a CPQ (Configure, Price, Quote) system immediately. At 15% automation and 7-day cycle time, this is the single largest bottleneck in the revenue pipeline. Estimated annual savings: $280K. Recommended vendors: Salesforce CPQ, DealHub." },
  { id: "p5", name: "Contract Review", department: "Legal", type: "process", status: "warning", cost: 32000, headcount: 4, cycleTime: 5, automationRate: 20, nextNodes: ["p6"], description: "Legal review and contract negotiation", recommendation: "Implement contract lifecycle management (CLM) software with pre-approved clause libraries. This can reduce review time from 5d to 2d for standard contracts (est. 70% of volume) while maintaining compliance." },
  { id: "p6", name: "Onboarding", department: "Operations", type: "process", status: "opportunity", cost: 22000, headcount: 6, cycleTime: 10, automationRate: 40, nextNodes: ["p7"], description: "New client onboarding and setup", recommendation: "Consolidate 6-team onboarding workflow into a single platform with automated task assignment. Current 10-day cycle can be reduced to 6 days, freeing 2.5 FTE and improving CSAT by an estimated 0.3 points." },
  { id: "p7", name: "Service Delivery", department: "Operations", type: "process", status: "optimal", cost: 95000, headcount: 22, cycleTime: 30, automationRate: 55, nextNodes: ["p8"], description: "Core service delivery and project execution", recommendation: "This process is performing well. Focus on increasing automation coverage from 55% to 70% through workflow tooling improvements. Monitor utilization rates to ensure headcount scales efficiently with revenue growth." },
  { id: "p8", name: "Invoicing & Billing", department: "Finance", type: "process", status: "opportunity", cost: 15000, headcount: 3, cycleTime: 3, automationRate: 45, nextNodes: ["p9"], description: "Invoice generation and payment collection", recommendation: "Enable automated invoice matching and payment reminders in QuickBooks. 45% of invoices currently require manual intervention. Automating standard invoice matching would reduce DSO by 8 days and save ~$95K annually." },
  { id: "p9", name: "Revenue Recognition", department: "Finance", type: "process", status: "optimal", cost: 8000, headcount: 2, cycleTime: 2, automationRate: 80, nextNodes: ["p10"], description: "Revenue recognition and financial reporting", recommendation: "This process is well-optimized. Maintain current automation level and consider expanding the 80% automation rate to include multi-currency recognition for international clients." },
  { id: "p10", name: "Renewal / Expansion", department: "Sales", type: "end", status: "warning", cost: 20000, headcount: 4, cycleTime: 14, automationRate: 25, nextNodes: [], description: "Client renewal and upsell opportunities", recommendation: "Implement a renewal early-warning system using CRM health scores. Current 14-day cycle and 25% automation rate leaves significant revenue at risk. Automated renewal reminders at 90/60/30 days could improve renewal rate by an estimated 8%." },
];

// ---- OPPORTUNITIES ----
export const opportunities: Opportunity[] = [
  {
    id: "o1",
    title: "Automate Proposal Generation",
    area: "Sales",
    processIds: ["p4"],
    type: "automation",
    impact: "high",
    effort: "medium",
    estimatedSaving: 280000,
    estimatedTimeToValue: "3-4 months",
    description: "Proposal creation is the most manual and time-consuming step in the sales cycle. Implementing a CPQ (Configure, Price, Quote) system with templated proposals could reduce cycle time from 7 days to under 1 day.",
    nextSteps: ["Evaluate CPQ vendors (Salesforce CPQ, DealHub, Conga)", "Map current proposal templates", "Define pricing rules and approval workflows", "Pilot with 2 sales reps for 30 days"],
    lever: "sales_cycle_reduction",
    baselineValue: 7,
    targetValue: 1,
    currentValue: 7,
  },
  {
    id: "o2",
    title: "Consolidate Onboarding Workflows",
    area: "Operations",
    processIds: ["p6"],
    type: "redesign",
    impact: "high",
    effort: "medium",
    estimatedSaving: 165000,
    estimatedTimeToValue: "2-3 months",
    description: "Client onboarding spans 6 teams with no unified system. Standardizing on a single onboarding platform with automated task assignment could reduce time-to-value by 40%.",
    nextSteps: ["Audit current onboarding steps across all teams", "Design standardized onboarding playbook", "Implement project management tooling", "Train team leads on new process"],
    lever: "onboarding_efficiency",
    baselineValue: 10,
    targetValue: 6,
    currentValue: 10,
  },
  {
    id: "o3",
    title: "Automate Invoice-to-Cash Cycle",
    area: "Finance",
    processIds: ["p8"],
    type: "automation",
    impact: "medium",
    effort: "low",
    estimatedSaving: 95000,
    estimatedTimeToValue: "1-2 months",
    description: "45% of invoices require manual intervention. Implementing automated invoice matching and payment reminders could reduce DSO by 8 days.",
    nextSteps: ["Configure automated payment reminders in QuickBooks", "Set up invoice matching rules", "Enable ACH/auto-pay options for clients", "Monitor DSO weekly for 60 days"],
    lever: "cash_collection",
    baselineValue: 32,
    targetValue: 24,
    currentValue: 32,
  },
  {
    id: "o4",
    title: "Lead Qualification Scoring Model",
    area: "Sales",
    processIds: ["p2"],
    type: "optimization",
    impact: "high",
    effort: "low",
    estimatedSaving: 210000,
    estimatedTimeToValue: "1 month",
    description: "Current qualification is entirely manual and subjective. Implementing a data-driven lead scoring model using CRM signals could increase conversion rate by 18%.",
    nextSteps: ["Define ideal customer profile (ICP) criteria", "Build lead scoring model in Salesforce", "Train sales team on score interpretation", "A/B test against current process"],
    lever: "conversion_rate",
    baselineValue: 22,
    targetValue: 40,
    currentValue: 22,
  },
  {
    id: "o5",
    title: "Eliminate Redundant Approval Layers",
    area: "Legal",
    processIds: ["p5"],
    type: "elimination",
    impact: "medium",
    effort: "low",
    estimatedSaving: 120000,
    estimatedTimeToValue: "2-4 weeks",
    description: "Contract review has 4 approval layers for standard contracts. Implementing pre-approved contract templates for deals under $50K could eliminate 60% of legal review time.",
    nextSteps: ["Identify standard contract types by deal size", "Create pre-approved template library", "Define escalation thresholds", "Update approval matrix in DocuSign"],
    lever: "legal_efficiency",
    baselineValue: 5,
    targetValue: 2,
    currentValue: 5,
  },
  {
    id: "o6",
    title: "Renewal Automation & Early Warning",
    area: "Sales",
    processIds: ["p10"],
    type: "automation",
    impact: "high",
    effort: "medium",
    estimatedSaving: 340000,
    estimatedTimeToValue: "3-5 months",
    description: "Renewals are managed reactively. Implementing health score monitoring and automated renewal workflows 90 days before expiry could increase renewal rate from 74% to 88%.",
    nextSteps: ["Define customer health score model", "Build renewal playbook in CRM", "Automate 90/60/30-day renewal sequences", "Train CSM team on health score interpretation"],
    lever: "retention_rate",
    baselineValue: 74,
    targetValue: 88,
    currentValue: 74,
  },
];

// ---- GOAL LEVERS ----
export const goalLevers: GoalLever[] = [
  { id: "l1", name: "Sales Cycle Reduction", description: "Reduce time from lead to close", category: "Sales", currentValue: 45, baselineValue: 45, targetValue: 28, unit: "days", impact: ["o1", "o4"] },
  { id: "l2", name: "Automation Coverage", description: "% of processes with automation", category: "Technology", currentValue: 38, baselineValue: 38, targetValue: 65, unit: "%", impact: ["o1", "o3", "o6"] },
  { id: "l3", name: "Headcount Efficiency", description: "Revenue generated per FTE", category: "HR", currentValue: 128, baselineValue: 128, targetValue: 165, unit: "K$/FTE", impact: ["o2", "o5"] },
  { id: "l4", name: "Client Retention Rate", description: "Annual contract renewal rate", category: "Customer", currentValue: 74, baselineValue: 74, targetValue: 88, unit: "%", impact: ["o6"] },
  { id: "l5", name: "Operating Cost Ratio", description: "OpEx as % of revenue", category: "Finance", currentValue: 42, baselineValue: 42, targetValue: 34, unit: "%", impact: ["o3", "o5"] },
  { id: "l6", name: "Time to Onboard", description: "Days from signed to live", category: "Operations", currentValue: 10, baselineValue: 10, targetValue: 6, unit: "days", impact: ["o2"] },
];

// ---- TREND DATA ----
export const trendData = {
  processEfficiency: [
    { month: "Jan", baseline: 65, current: 65, goal: 85 },
    { month: "Feb", baseline: 65, current: 66, goal: 85 },
    { month: "Mar", baseline: 65, current: 67, goal: 85 },
    { month: "Apr", baseline: 65, current: 69, goal: 85 },
    { month: "May", baseline: 65, current: 71, goal: 85 },
    { month: "Jun", baseline: 65, current: 73, goal: 85 },
    { month: "Jul", baseline: 65, current: null, goal: 85 },
    { month: "Aug", baseline: 65, current: null, goal: 85 },
    { month: "Sep", baseline: 65, current: null, goal: 85 },
    { month: "Oct", baseline: 65, current: null, goal: 85 },
    { month: "Nov", baseline: 65, current: null, goal: 85 },
    { month: "Dec", baseline: 65, current: null, goal: 85 },
  ],
  costTrend: [
    { month: "Jan", value: 4.8 },
    { month: "Feb", value: 4.7 },
    { month: "Mar", value: 4.6 },
    { month: "Apr", value: 4.5 },
    { month: "May", value: 4.3 },
    { month: "Jun", value: 4.2 },
  ],
  departmentCosts: [
    { dept: "Operations", cost: 1.8, headcount: 28 },
    { dept: "Sales", cost: 1.2, headcount: 20 },
    { dept: "Technology", cost: 0.7, headcount: 12 },
    { dept: "Finance", cost: 0.3, headcount: 5 },
    { dept: "Legal", cost: 0.2, headcount: 4 },
  ],
};

// ---- REPORT DATA ----
export const reportSections: ReportSection[] = [
  {
    id: "r1",
    title: "Executive Summary",
    type: "summary",
    priority: 1,
    content: "Based on analysis of 6 connected data sources spanning 284,100+ records, VantageIQ has identified 6 high-priority opportunity areas with a combined estimated annual impact of $1.21M. The organization demonstrates strong operational fundamentals with a 73% process efficiency score, but significant value is being left on the table in Sales cycle management, client onboarding, and contract review workflows.",
  },
  {
    id: "r2",
    title: "Key Findings",
    type: "finding",
    priority: 2,
    content: "The proposal generation process (p4) is the single largest bottleneck in the revenue cycle, consuming 8 FTEs and averaging 7 days per proposal. Legal review layers add 5 days to standard contracts that could be pre-approved. Client onboarding lacks a unified system, causing an average 10-day time-to-value that is 67% longer than industry benchmark.",
  },
  {
    id: "r3",
    title: "Opportunity Landscape",
    type: "opportunity",
    priority: 3,
    content: "Six opportunities have been identified and ranked by impact-to-effort ratio. Three are classified as Quick Wins (high impact, low effort) that can be executed within 30-60 days. Two are Strategic Initiatives requiring 3-5 months of implementation. One is a Foundational Investment that enables future automation.",
  },
  {
    id: "r4",
    title: "Recommended Roadmap",
    type: "roadmap",
    priority: 4,
    content: "Phase 1 (Weeks 1-8): Execute Quick Wins — Lead Scoring Model, Invoice Automation, Contract Template Library. Phase 2 (Months 3-5): Strategic Initiatives — Proposal Automation (CPQ), Onboarding Consolidation. Phase 3 (Months 6-12): Renewal Automation and continuous improvement monitoring.",
  },
  {
    id: "r5",
    title: "Projected Impact",
    type: "recommendation",
    priority: 5,
    content: "If all 6 opportunities are executed per the recommended roadmap, the organization can expect: 28% reduction in sales cycle length, 18% improvement in lead-to-close conversion, 40% reduction in onboarding time, 14% improvement in client retention, and $1.21M in annualized cost savings within 12 months.",
  },
];
