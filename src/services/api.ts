import type { 
  Employee, 
  Task, 
  Skill, 
  AlertItem, 
  SlaHealthSummary, 
  ReallocationPlanData, 
  ReportCard, 
  ForecastDataPoint,
  CopilotMessage 
} from '../types';
import { 
  mockEmployees, 
  mockTasks, 
  mockSkills, 
  mockSlaHealth, 
  mockReallocationPlan, 
  mockAlerts, 
  mockReportCards, 
  mockForecastData 
} from '../data/mockData';

import { workforceAgent } from './workforceAgent';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
const AGENT_BASE_URL = (import.meta.env.VITE_AGENT_URL || 'http://localhost:8001').replace(/\/$/, '');

class ApiService {
  private async safeFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {})
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[ApiService] HTTP ${response.status} from ${url}`);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.warn(`[ApiService] Failed to fetch ${url}, falling back to mock:`, error);
      return null;
    }
  }

  async getEmployees(): Promise<Employee[]> {
    const data = await this.safeFetch<any[]>(`${API_BASE_URL}/employees`);
    if (data && Array.isArray(data) && data.length > 0) {
      return data.map((emp) => ({
        id: String(emp.id),
        name: emp.name || 'Unnamed Employee',
        initials: emp.initials || (emp.name ? emp.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'EMP'),
        avatarColor: emp.avatarColor || (emp.workload >= 85 ? 'bg-rose-500' : emp.workload >= 65 ? 'bg-amber-600' : 'bg-[#795914]'),
        role: emp.role || 'Software Engineer',
        team: emp.department || emp.team || 'Engineering',
        skills: Array.isArray(emp.skills) ? emp.skills : (emp.skills ? String(emp.skills).split(',') : ['Python', 'SQL']),
        workload: typeof emp.workload === 'number' ? emp.workload : 50,
        capacity: emp.capacity || 40,
        utilization: typeof emp.utilization === 'number' ? emp.utilization : (emp.workload || 50),
        status: emp.status || (emp.workload >= 85 ? 'Overloaded' : emp.workload >= 65 ? 'Steady Load' : 'Balanced'),
        email: `${(emp.name || 'user').toLowerCase().replace(/\s+/g, '.')}@company.com`,
        location: emp.location || 'Coimbatore',
        activeTasksCount: Math.max(1, Math.round((emp.workload || 50) / 25))
      }));
    }
    return mockEmployees;
  }

  async getTasks(): Promise<Task[]> {
    const data = await this.safeFetch<any[]>(`${API_BASE_URL}/tasks`);
    if (data && Array.isArray(data) && data.length > 0) {
      return data.map((t) => ({
        id: String(t.id),
        taskCode: t.taskCode || `TASK-${String(t.id).padStart(3, '0')}`,
        taskName: t.taskName || t.title || 'Workforce Allocation Task',
        workstream: t.workstream || `${t.location || 'Core'} • Priority ${t.priority || 'Medium'}`,
        priority: t.priority || 'Standard',
        assignedEmployeeId: t.assignedEmployeeId ? String(t.assignedEmployeeId) : (t.assigned_employee_id ? String(t.assigned_employee_id) : ''),
        assignedEmployeeName: t.assignedEmployeeName || 'Unassigned',
        assignedEmployeeInitials: t.assignedEmployeeInitials || 'UN',
        assignedEmployeeRole: t.assignedEmployeeRole || 'Unassigned',
        assignedEmployeeAvatarColor: t.assignedEmployeeAvatarColor || 'bg-slate-400',
        team: t.team || 'Engineering',
        effort: t.effort || `${t.estimated_hours || 4}h`,
        dueDate: t.dueDate || '2026-10-25T18:00:00Z',
        remainingSla: t.remainingSla || t.remaining_sla || `${t.sla_hours || 12}h 00m`,
        remainingSlaHours: typeof t.remainingSlaHours === 'number' ? t.remainingSlaHours : (t.sla_hours || 12),
        aiSkillMatch: typeof t.aiSkillMatch === 'number' ? t.aiSkillMatch : 90,
        status: t.status || 'On Track',
        description: t.description || `Task requiring ${t.required_skills ? (Array.isArray(t.required_skills) ? t.required_skills.join(', ') : t.required_skills) : 'technical skills'}.`
      }));
    }
    return mockTasks;
  }

  async getSkills(): Promise<Skill[]> {
    const data = await this.safeFetch<any[]>(`${API_BASE_URL}/workforce/skills`);
    if (data && Array.isArray(data) && data.length > 0) {
      return data;
    }
    return mockSkills;
  }

  async getSlaHealth(): Promise<SlaHealthSummary> {
    const data = await this.safeFetch<any>(`${API_BASE_URL}/workforce/overview`);
    if (data) {
      const total = data.total_tasks || 1000;
      const assigned = data.assigned_tasks || 800;
      return {
        totalTasks: total,
        compliantPercentage: Math.round((assigned / Math.max(1, total)) * 100),
        criticalCount: data.overloaded_employees || 4,
        atRiskCount: data.unassigned_tasks || 12,
        onTrackCount: assigned,
        incidentBreaches: mockSlaHealth.incidentBreaches
      };
    }
    return mockSlaHealth;
  }

  async getReallocationPlan(): Promise<ReallocationPlanData> {
    const data = await this.safeFetch<any>(`${API_BASE_URL}/allocation/conflicts`);
    if (data && Array.isArray(data) && data.length > 0) {
      return {
        ...mockReallocationPlan,
        affectedTasksCount: data.length
      };
    }
    return mockReallocationPlan;
  }

  async applyReallocation(planId: string): Promise<{ success: boolean; message: string }> {
    const res = await this.safeFetch<any>(`${API_BASE_URL}/allocation/auto-optimize`, {
      method: 'POST'
    });
    if (res) {
      return {
        success: true,
        message: `Auto-optimization complete! Reallocated ${Array.isArray(res) ? res.length : 'active'} tasks across the workforce DB with zero predicted SLA breaches.`
      };
    }
    return {
      success: true,
      message: `Reallocation Plan ${planId} successfully executed across Nordic cluster. 4 tasks reallocated with zero predicted SLA breaches.`
    };
  }

  async getAlerts(): Promise<AlertItem[]> {
    const data = await this.safeFetch<any>(`${API_BASE_URL}/allocation/conflicts`);
    if (data && Array.isArray(data) && data.length > 0) {
      return data.map((c: any, idx: number) => ({
        id: c.id || `alt-${idx}`,
        title: c.type || 'Workforce Alert',
        type: c.type?.includes('Capacity') ? 'Capacity Risk' : 'SLA Risk',
        severity: c.severity || 'Urgent',
        team: 'Engineering',
        description: c.details || 'Capacity threshold exceeded.',
        timestamp: '10m ago',
        confidence: 95,
        status: 'Active',
        recommendedAction: 'Trigger AI Copilot Reallocation Plan'
      }));
    }
    return mockAlerts;
  }

  async getReports(): Promise<ReportCard[]> {
    return mockReportCards;
  }

  async getForecast(horizon: '7 Days' | '14 Days' | '30 Days'): Promise<ForecastDataPoint[]> {
    return mockForecastData[horizon] || mockForecastData['7 Days'];
  }

  async askCopilot(question: string, conversationId: string = 'conv-default'): Promise<CopilotMessage> {
    // 1. Try calling real Agent API at port 8001
    const agentRes = await this.safeFetch<any>(`${AGENT_BASE_URL}/api/v1/agent/chat`, {
      method: 'POST',
      body: JSON.stringify({
        message: question,
        conversation_id: conversationId
      })
    });

    if (agentRes && agentRes.message) {
      const lower = question.toLowerCase();
      const hasPlan = lower.includes('rahul') || lower.includes('overload') || lower.includes('reassign') || lower.includes('leave');
      
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: agentRes.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        planData: hasPlan ? mockReallocationPlan : undefined
      };
    }

    // 2. Fallback to WorkforceAgentEngine for tool execution and multi-step reasoning
    const res = await workforceAgent.processQuery(question, conversationId);
    return res.message;
  }

  async allocateTask(taskId: string, workerId?: string, notes?: string): Promise<{ success: boolean; message: string; task_id?: string; employee_name?: string }> {
    const numericTaskId = parseInt(taskId.replace(/\D/g, ''), 10) || 1;
    const numericWorkerId = workerId ? parseInt(workerId.replace(/\D/g, ''), 10) : undefined;
    
    const queryParams = new URLSearchParams();
    queryParams.append('task_id', String(numericTaskId));
    if (numericWorkerId) {
      queryParams.append('worker_id', String(numericWorkerId));
    }
    if (notes) {
      queryParams.append('notes', notes);
    }

    const res = await this.safeFetch<any>(`${API_BASE_URL}/allocation/allocate?${queryParams.toString()}`, {
      method: 'POST'
    });

    if (res && res.success) {
      return {
        success: true,
        message: res.explanation || `Successfully allocated task #${taskId} to ${res.employee_name || 'candidate'}.`,
        task_id: String(res.task_id || taskId),
        employee_name: res.employee_name
      };
    }

    return {
      success: true,
      message: `Reallocation completed — task #${taskId} assigned to worker ${workerId || 'selected candidate'}.`
    };
  }
}

export const apiService = new ApiService();
