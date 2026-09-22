export type WorkloadStatus = 'Overloaded' | 'Optimal Available' | 'Balanced' | 'Steady Load';

export interface Employee {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  role: string;
  team: string;
  skills: string[];
  workload: number; // Percentage, e.g., 95
  capacity: number; // Weekly hours available, e.g., 40
  utilization: number; // Percentage
  status: WorkloadStatus;
  email: string;
  location: string;
  activeTasksCount: number;
}

export type TaskStatus = 'Approaching' | 'On Track' | 'Optimal' | 'Critical Breach';
export type TaskPriority = 'Critical' | 'Urgent' | 'Standard' | 'Low';

export interface Task {
  id: string;
  taskCode: string;
  taskName: string;
  workstream: string;
  priority: TaskPriority;
  assignedEmployeeId: string;
  assignedEmployeeName: string;
  assignedEmployeeInitials: string;
  assignedEmployeeRole: string;
  assignedEmployeeAvatarColor: string;
  team: string;
  effort: string; // e.g. "8h", "16h"
  dueDate: string;
  remainingSla: string; // e.g., "8h 00m"
  remainingSlaHours: number;
  aiSkillMatch: number; // e.g. 92
  status: TaskStatus;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number; // 0 - 100
  totalEngineers: number;
  skillGapPercentage: number;
  demandLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  targetCoverage: number;
}

export type AlertType = 'SLA Risk' | 'Capacity Risk' | 'Workload Risk' | 'Skill Gap' | 'Task Risk';
export type AlertSeverity = 'Critical' | 'Urgent' | 'Moderate' | 'Info';

export interface AlertItem {
  id: string;
  title: string;
  type: AlertType;
  severity: AlertSeverity;
  team: string;
  description: string;
  timestamp: string;
  confidence: number;
  status: 'Active' | 'Mitigating' | 'Resolved';
  recommendedAction: string;
}

export interface ReasoningConstraint {
  title: string;
  tag: string;
  value: string;
  detail: string;
  iconType: 'skill' | 'balance' | 'sla' | 'timezone' | 'performance';
}

export interface ProposedIntervention {
  taskId: string;
  taskCode: string;
  taskName: string;
  workstream: string;
  severityBadge: string;
  remainingSla: string;
  originalAssignee: string;
  originalAssigneeReason: string;
  recommendedAssignee: string;
  recommendedAssigneeInitials: string;
  recommendedRole: string;
  fitScore: number;
  capacityDelta: string;
}

export interface ImpactSummary {
  zeroBreaches: boolean;
  loadShift: string;
  webhookNotice: string;
  burnRateStatus: string;
}

export interface ReallocationPlanData {
  planId: string;
  computedTime: string;
  affectedTasksCount: number;
  criticalSlaWindow: string;
  capacitySafety: string;
  totalUnmitigatedRisk: string;
  reasoning: ReasoningConstraint[];
  interventions: ProposedIntervention[];
  impactSummary: ImpactSummary;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isInitialPrompt?: boolean;
  planData?: ReallocationPlanData;
}

export interface IncidentBreach {
  id: string;
  ticketCode: string;
  title: string;
  team: string;
  assignedTo: string;
  remainingTime: string;
  isUrgent: boolean;
}

export interface SlaHealthSummary {
  totalTasks: number;
  compliantPercentage: number;
  criticalCount: number;
  atRiskCount: number;
  onTrackCount: number;
  incidentBreaches: IncidentBreach[];
}

export interface ReportCard {
  id: string;
  title: string;
  category: string;
  description: string;
  lastGenerated: string;
  metrics: string;
  format: 'PDF' | 'CSV' | 'JSON' | 'XLSX';
}

export interface ForecastDataPoint {
  date: string;
  currentCapacity: number;
  predictedCapacity: number;
  expectedWorkload: number;
  shortage: number;
  surplus: number;
}
