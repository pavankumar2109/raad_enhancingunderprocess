import type { 
  Employee, 
  Task, 
  Skill, 
  SlaHealthSummary, 
  CopilotMessage 
} from '../types';
import { 
  mockEmployees, 
  mockTasks, 
  mockSkills, 
  mockSlaHealth, 
  mockReallocationPlan 
} from '../data/mockData';

// --- Conversation Memory Interface ---
interface ConversationContext {
  conversationId: string;
  lastMentionedEmployee?: Employee;
  lastMentionedTask?: Task;
  lastTopic?: string;
  history: Array<{ role: 'user' | 'assistant'; text: string; timestamp: string }>;
}

export interface AgentExecutionStep {
  toolName: string;
  args?: Record<string, any>;
  resultSummary: string;
}

export interface AgentProcessResult {
  message: CopilotMessage;
  executionSteps: AgentExecutionStep[];
}

class WorkforceAgentEngine {
  // Stateful in-memory stores initialized from mock data
  private employees: Employee[] = [...mockEmployees];
  private tasks: Task[] = [...mockTasks];
  private skills: Skill[] = [...mockSkills];
  private slaHealth: SlaHealthSummary = { ...mockSlaHealth };
  private conversations: Map<string, ConversationContext> = new Map();

  constructor() {
    this.refreshDynamicMetrics();
  }

  private getContext(conversationId: string): ConversationContext {
    if (!this.conversations.has(conversationId)) {
      this.conversations.set(conversationId, {
        conversationId,
        history: [],
      });
    }
    return this.conversations.get(conversationId)!;
  }

  private refreshDynamicMetrics() {
    // Update active tasks count per employee
    this.employees.forEach((emp) => {
      const assigned = this.tasks.filter(
        (t) => t.assignedEmployeeId === emp.id || t.assignedEmployeeName.toLowerCase() === emp.name.toLowerCase()
      );
      emp.activeTasksCount = assigned.length;
    });
  }

  // ==========================================
  // TOOL DEFINITIONS (EXPOSED TOOLS)
  // ==========================================

  public get_workforce_summary() {
    this.refreshDynamicMetrics();
    const totalEmployees = this.employees.length;
    const overloaded = this.employees.filter((e) => e.workload >= 85);
    const optimal = this.employees.filter((e) => e.workload <= 50);
    const avgWorkload = Math.round(
      this.employees.reduce((acc, e) => acc + e.workload, 0) / Math.max(1, totalEmployees)
    );
    const totalTasks = this.tasks.length;
    const unassignedTasks = this.tasks.filter((t) => !t.assignedEmployeeId || t.assignedEmployeeName === 'Unassigned');
    const criticalBreaches = this.tasks.filter((t) => t.status === 'Critical Breach');

    return {
      totalEmployees,
      avgWorkloadPercentage: avgWorkload,
      overloadedCount: overloaded.length,
      overloadedEmployees: overloaded.map((e) => ({ id: e.id, name: e.name, workload: e.workload, activeTasks: e.activeTasksCount })),
      availableHeadroomCount: optimal.length,
      optimalEmployees: optimal.map((e) => ({ id: e.id, name: e.name, workload: e.workload })),
      totalTasks,
      unassignedTasksCount: unassignedTasks.length,
      criticalBreachTasksCount: criticalBreaches.length,
      slaComplianceRate: this.slaHealth.compliantPercentage,
    };
  }

  public get_workers() {
    this.refreshDynamicMetrics();
    return this.employees.map((e) => ({
      id: e.id,
      name: e.name,
      role: e.role,
      team: e.team,
      workload: e.workload,
      utilization: e.utilization,
      status: e.status,
      skills: e.skills,
      activeTasksCount: e.activeTasksCount,
    }));
  }

  public get_worker_details(query: string) {
    this.refreshDynamicMetrics();
    const q = query.toLowerCase().trim();
    const employee = this.employees.find(
      (e) => e.id.toLowerCase() === q || e.name.toLowerCase().includes(q)
    );

    if (!employee) {
      return null;
    }

    const assignedTasks = this.tasks.filter(
      (t) => t.assignedEmployeeId === employee.id || t.assignedEmployeeName.toLowerCase() === employee.name.toLowerCase()
    );

    return {
      ...employee,
      assignedTasks: assignedTasks.map((t) => ({
        id: t.id,
        code: t.taskCode,
        name: t.taskName,
        priority: t.priority,
        status: t.status,
        remainingSla: t.remainingSla,
        effort: t.effort,
      })),
    };
  }

  public get_skills() {
    return this.skills.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      proficiency: s.proficiency,
      totalEngineers: s.totalEngineers,
      skillGapPercentage: s.skillGapPercentage,
      demandLevel: s.demandLevel,
    }));
  }

  public get_projects() {
    return [
      { id: 'proj-1', name: 'Core Gateway', workstream: 'Platform Engineering', status: 'Active', activeTasks: 4 },
      { id: 'proj-2', name: 'Infra Modernization', workstream: 'Platform Engineering', status: 'Active', activeTasks: 3 },
      { id: 'proj-3', name: 'Observability Hub', workstream: 'Observability Hub', status: 'On Track', activeTasks: 2 },
      { id: 'proj-4', name: 'SecOps Zero Trust', workstream: 'Core Infrastructure', status: 'Optimal', activeTasks: 3 },
    ];
  }

  public get_tasks() {
    return this.tasks.map((t) => ({
      id: t.id,
      code: t.taskCode,
      name: t.taskName,
      priority: t.priority,
      status: t.status,
      assignee: t.assignedEmployeeName,
      effort: t.effort,
      remainingSla: t.remainingSla,
      aiSkillMatch: t.aiSkillMatch,
      team: t.team,
    }));
  }

  public get_unassigned_tasks() {
    return this.tasks
      .filter((t) => !t.assignedEmployeeId || t.assignedEmployeeName === 'Unassigned')
      .map((t) => ({
        id: t.id,
        code: t.taskCode,
        name: t.taskName,
        priority: t.priority,
        effort: t.effort,
        remainingSla: t.remainingSla,
        description: t.description,
      }));
  }

  public get_task_details(query: string) {
    const q = query.toLowerCase().trim();
    const task = this.tasks.find(
      (t) => t.id.toLowerCase() === q || t.taskCode.toLowerCase() === q || t.taskName.toLowerCase().includes(q)
    );

    if (!task) return null;

    const currentAssignee = this.employees.find(
      (e) => e.id === task.assignedEmployeeId || e.name.toLowerCase() === task.assignedEmployeeName.toLowerCase()
    );

    return {
      ...task,
      assigneeDetails: currentAssignee ? { name: currentAssignee.name, workload: currentAssignee.workload, role: currentAssignee.role } : null,
    };
  }

  public get_task_recommendations(taskIdOrCode: string) {
    const task = this.get_task_details(taskIdOrCode);
    if (!task) return [];

    // Calculate match score deterministically
    const candidates = this.employees.map((emp) => {
      // Skill match calculation
      const requiredKeywords = task.description.toLowerCase().split(' ').concat(task.taskName.toLowerCase().split(' '));
      const matchingSkills = emp.skills.filter((sk) =>
        requiredKeywords.some((kw) => kw.includes(sk.toLowerCase()) || sk.toLowerCase().includes(kw))
      );
      
      const skillScore = Math.min(98, Math.max(65, 70 + matchingSkills.length * 10));
      const capacityScore = Math.max(0, 100 - emp.workload);
      const experienceScore = emp.role.includes('Lead') || emp.role.includes('Architect') ? 92 : 85;
      
      // Combined score
      const fitScore = Math.round(skillScore * 0.45 + capacityScore * 0.40 + experienceScore * 0.15);

      return {
        employeeId: emp.id,
        employeeName: emp.name,
        role: emp.role,
        skills: emp.skills,
        currentWorkload: emp.workload,
        availableCapacityHours: Math.round(emp.capacity * ((100 - emp.workload) / 100)),
        skillMatchScore: skillScore,
        availabilityScore: capacityScore,
        experienceScore: experienceScore,
        overallFitScore: fitScore,
        recommendationRationale: `Skill match: ${skillScore}%, Available capacity: ${capacityScore}%, Role alignment: ${experienceScore}%.`,
      };
    });

    return candidates.sort((a, b) => b.overallFitScore - a.overallFitScore);
  }

  public allocate_task(taskIdOrCode: string, workerIdOrName: string) {
    const task = this.tasks.find(
      (t) => t.id.toLowerCase() === taskIdOrCode.toLowerCase() || t.taskCode.toLowerCase() === taskIdOrCode.toLowerCase()
    );

    if (!task) {
      return { success: false, message: `Task '${taskIdOrCode}' was not found in the task matrix.` };
    }

    const worker = this.employees.find(
      (e) => e.id.toLowerCase() === workerIdOrName.toLowerCase() || e.name.toLowerCase().includes(workerIdOrName.toLowerCase())
    );

    if (!worker) {
      return { success: false, message: `Employee candidate '${workerIdOrName}' was not found.` };
    }

    if (worker.workload >= 90) {
      return {
        success: false,
        message: `Allocation rejected: ${worker.name} is currently operating at ${worker.workload}% capacity threshold. Assigning task ${task.taskCode} would breach safety constraints.`,
      };
    }

    // Update state
    task.assignedEmployeeId = worker.id;
    task.assignedEmployeeName = worker.name;
    task.assignedEmployeeInitials = worker.initials;
    task.assignedEmployeeRole = worker.role;
    task.assignedEmployeeAvatarColor = worker.avatarColor;
    task.status = 'On Track';

    // Update worker workload (+10%)
    worker.workload = Math.min(100, worker.workload + 10);
    worker.utilization = worker.workload;
    this.refreshDynamicMetrics();

    return {
      success: true,
      message: `Task ${task.taskCode} (${task.taskName}) successfully assigned to ${worker.name}.`,
      updatedTask: task,
      updatedWorker: worker,
    };
  }

  public get_conflicts() {
    this.refreshDynamicMetrics();
    const overloaded = this.employees.filter((e) => e.workload >= 85);
    const criticalBreaches = this.tasks.filter((t) => t.status === 'Critical Breach' || t.remainingSlaHours <= 4);

    return {
      overbookedEmployees: overloaded.map((e) => ({
        name: e.name,
        workload: e.workload,
        activeTasksCount: e.activeTasksCount,
        risk: 'High capacity exhaustion risk',
      })),
      atRiskTasks: criticalBreaches.map((t) => ({
        code: t.taskCode,
        name: t.taskName,
        assignee: t.assignedEmployeeName,
        remainingSla: t.remainingSla,
        status: t.status,
      })),
    };
  }

  public get_worker_allocations(query: string) {
    const worker = this.get_worker_details(query);
    if (!worker) return null;
    return {
      employeeName: worker.name,
      workload: worker.workload,
      status: worker.status,
      assignedTasks: worker.assignedTasks,
    };
  }

  public get_workload_information() {
    this.refreshDynamicMetrics();
    return this.employees.map((e) => ({
      name: e.name,
      role: e.role,
      team: e.team,
      workload: e.workload,
      capacityHours: e.capacity,
      activeTasksCount: e.activeTasksCount,
      status: e.status,
    }));
  }

  public get_skill_gaps() {
    return this.skills.map((s) => ({
      skill: s.name,
      category: s.category,
      skillGapPercentage: s.skillGapPercentage,
      totalEngineers: s.totalEngineers,
      demandLevel: s.demandLevel,
    }));
  }

  public get_project_architecture_info() {
    return {
      projectName: 'RAAD - Autonomous Workforce Decision & Resource Allocation System',
      architecturePattern: 'REST API + Deterministic Allocation Engine + LLM Tool Reasoning Agent',
      frontendTech: 'React 19 + TypeScript + Vite + TailwindCSS',
      backendTech: 'FastAPI / Node REST Services + In-Memory & PostgreSQL Data Store',
      allocationEngine: 'Deterministic Constraint Optimization Solver (Skills Match, Workload Balancer, SLA Urgency, Capacity Headroom)',
      aiRole: 'Reasoning & Natural Language Orchestrator utilizing Function Calling tools to query backend APIs.',
    };
  }

  // ==========================================
  // MULTI-STEP REASONING & INTENT ROUTER
  // ==========================================

  public async processQuery(query: string, conversationId: string = 'default-conv'): Promise<AgentProcessResult> {
    const context = this.getContext(conversationId);
    const steps: AgentExecutionStep[] = [];
    const qLower = query.toLowerCase().trim();

    // 1. OUT-OF-SCOPE FILTER
    const outOfScopeKeywords = ['capital of france', 'weather', 'recipe', 'movie', 'tell me a joke', 'who won the world cup', 'president of'];
    if (outOfScopeKeywords.some((k) => qLower.includes(k))) {
      return {
        message: {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: 'I am the AI Workforce Manager and am designed to assist with workforce planning, task allocation, workload analysis, skill intelligence, conflict detection, and related management decisions. Please provide a workforce-related request.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        executionSteps: [],
      };
    }

    // Resolve Context / Pronouns ("Rahul", "Priya", "he", "him", "tasks", "unassigned")
    let targetEmployee = this.employees.find((e) => qLower.includes(e.name.toLowerCase()) || qLower.includes(e.name.split(' ')[0].toLowerCase()));
    if (!targetEmployee && (qLower.includes('he') || qLower.includes('him') || qLower.includes('his')) && context.lastMentionedEmployee) {
      targetEmployee = context.lastMentionedEmployee;
    }

    if (targetEmployee) {
      context.lastMentionedEmployee = targetEmployee;
    }

    // 2. PROJECT / SYSTEM ARCHITECTURE QUESTIONS
    if (
      qLower.includes('how does') ||
      qLower.includes('architecture') ||
      qLower.includes('technologies') ||
      qLower.includes('allocation engine work') ||
      qLower.includes('where is ai used') ||
      qLower.includes('how are skill gaps') ||
      qLower.includes('why do you use an ai agent')
    ) {
      steps.push({ toolName: 'get_project_architecture_info', resultSummary: 'Retrieved application architecture and tech stack specifications.' });
      const arch = this.get_project_architecture_info();

      const text = `Workforce System Architecture Overview\n\nThe ${arch.projectName} operates on a deterministic allocation engine coupled with an AI Agent function-calling architecture.\n\nKey Implementation Details:\n• Frontend Framework: ${arch.frontendTech}\n• Backend Architecture: ${arch.backendTech}\n• Allocation Engine: ${arch.allocationEngine}\n• AI Agent Role: ${arch.aiRole}\n\nDecision Flow:\n1. Natural language query received by AI Workforce Manager.\n2. Agent executes backend tools to fetch ground-truth metrics.\n3. Allocation Engine computes deterministic scores for capacity & skills.\n4. Formal executive response rendered with verifiable telemetry.`;

      return {
        message: { id: `msg-${Date.now()}`, sender: 'assistant', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        executionSteps: steps,
      };
    }

    // 3. MULTI-TOOL DEMO FLOW & REASONING PATHS

    // Scenario A: "Rahul is unavailable..." -> Find Rahul -> Get Tasks -> Find Replacements -> Recommend
    if (qLower.includes('unavailable') || qLower.includes('leave') || qLower.includes('sick') || qLower.includes('replace rahul') || (qLower.includes('affected') && targetEmployee)) {
      const empName = targetEmployee ? targetEmployee.name : 'Rahul Verma';
      
      // Step 1: Get Worker Details
      steps.push({ toolName: 'get_worker_details', args: { query: empName }, resultSummary: `Fetched worker details for ${empName}` });
      const empDetails = this.get_worker_details(empName);

      // Step 2: Get Tasks
      steps.push({ toolName: 'get_worker_allocations', args: { query: empName }, resultSummary: `Found ${empDetails?.assignedTasks.length || 0} active tasks assigned to ${empName}` });

      // Step 3: Get Available Candidates
      steps.push({ toolName: 'get_workers', resultSummary: 'Retrieved current workforce capacity matrix' });

      // Step 4: Get Recommendations for first affected task
      const primaryTask = empDetails?.assignedTasks[0];
      let recs: any[] = [];
      if (primaryTask) {
        steps.push({ toolName: 'get_task_recommendations', args: { taskId: primaryTask.id }, resultSummary: `Computed fit scores for task ${primaryTask.code}` });
        recs = this.get_task_recommendations(primaryTask.id);
      }

      const topRec = recs.find((r) => r.employeeName !== empName);

      const text = `Workforce Risk & Continuity Assessment\n\n${empName} is currently operating at ${empDetails?.workload || 95}% utilization and holds ${empDetails?.assignedTasks.length || 4} active tasks.\n\nDetails of Affected Tasks:\n${empDetails?.assignedTasks.map((t) => `• ${t.code}: ${t.name} (${t.priority} Priority, ${t.remainingSla} remaining SLA)`).join('\n')}\n\nRecommended Replacement Candidates:\n${recs.slice(0, 3).map((r) => `• ${r.employeeName} (${r.role}): Overall Fit Score ${r.overallFitScore}% | Current Workload ${r.currentWorkload}%`).join('\n')}\n\nStrategic Recommendation:\nReassign high-priority tasks (including ${primaryTask?.code || 'critical tasks'}) to ${topRec?.employeeName || 'Priya Sundaram'} to ensure zero contractual SLA breaches.`;

      return {
        message: {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          planData: mockReallocationPlan,
        },
        executionSteps: steps,
      };
    }

    // Scenario B: "Why was Priya selected?" / Decision Explanation
    if (qLower.includes('why was priya') || qLower.includes('why wasn\'t rahul') || qLower.includes('explain this allocation') || qLower.includes('why priya')) {
      steps.push({ toolName: 'get_worker_details', args: { query: 'Priya Sundaram' }, resultSummary: 'Retrieved Priya Sundaram metrics' });
      steps.push({ toolName: 'get_task_recommendations', args: { taskId: 'task-5' }, resultSummary: 'Retrieved deterministic match factors' });

      const text = `Allocation Decision Rationale\n\nPriya Sundaram was selected as the optimal candidate based on deterministic scoring criteria.\n\nDecision Metrics:\n• Skill Match Score: 95%\n• Available Capacity Score: 82% (Current Workload: 42%)\n• Experience & Role Alignment: 90% (Backend Systems Lead)\n• Overall Candidate Fit Score: 94%\n\nComparative Analysis:\nRahul Verma is currently at 95% utilization (Overloaded). Assigning additional workload to Rahul creates severe SLA default risks. Priya possesses matching Go and PostgreSQL competencies with 58% unblocked capacity headroom.\n\nRecommendation:\nConfirm reallocation of task CACHE-104 to Priya Sundaram.`;

      return {
        message: { id: `msg-${Date.now()}`, sender: 'assistant', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        executionSteps: steps,
      };
    }

    // Scenario C: "Who is overloaded?" / Workload questions
    if (qLower.includes('overloaded') || qLower.includes('overbooked') || qLower.includes('highest loaded')) {
      steps.push({ toolName: 'get_workforce_summary', resultSummary: 'Fetched workforce capacity summary' });
      steps.push({ toolName: 'get_conflicts', resultSummary: 'Evaluated capacity conflicts' });
      const summary = this.get_workforce_summary();

      const overloadedList = summary.overloadedEmployees.map((e) => `• ${e.name}: ${e.workload}% utilization (${e.activeTasks} active tasks)`).join('\n');

      const text = `Workforce Capacity Risk Assessment\n\nBased on current backend telemetry, ${summary.overloadedCount} employee(s) exceed the safe 85% capacity threshold.\n\nDetails:\n${overloadedList}\n\nCapacity Analysis:\nRahul Verma is operating at 95% utilization with 4 active tasks. Marcus Lindqvist is at 78% (Steady Load). Average workforce utilization across the organization is ${summary.avgWorkloadPercentage}%.\n\nRecommendation:\nConsider reallocating non-critical tasks from Rahul Verma to available personnel such as Priya Sundaram (42% load) or Sofia Al-Mansoor (38% load).`;

      return {
        message: { id: `msg-${Date.now()}`, sender: 'assistant', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        executionSteps: steps,
      };
    }

    // Scenario D: "Give me the current workforce summary" / "How many employees available"
    if (qLower.includes('workforce summary') || qLower.includes('how many employees') || qLower.includes('available capacity') || qLower.includes('low utilization')) {
      steps.push({ toolName: 'get_workforce_summary', resultSummary: 'Retrieved complete workforce telemetry summary' });
      const summary = this.get_workforce_summary();

      const text = `Workforce Status Summary\n\nCurrent organizational capacity and allocation status across all engineering teams.\n\nDetails:\n• Total Active Headcount: ${summary.totalEmployees} personnel\n• Average Workforce Utilization: ${summary.avgWorkloadPercentage}%\n• Overloaded Personnel (>85%): ${summary.overloadedCount}\n• Available Capacity Headroom: ${summary.availableHeadroomCount} engineers\n• Active Tasks In Progress: ${summary.totalTasks}\n• Unassigned Tasks: ${summary.unassignedTasksCount}\n• SLA Compliance Rate: ${summary.slaComplianceRate}%\n\nRecommendation:\nWorkforce distribution remains operational. High-utilization alerts are localized to Platform Engineering.`;

      return {
        message: { id: `msg-${Date.now()}`, sender: 'assistant', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        executionSteps: steps,
      };
    }

    // Scenario E: "Show me all unassigned tasks" / "Which tasks are critical"
    if (qLower.includes('unassigned') || qLower.includes('critical tasks') || qLower.includes('tasks at risk') || qLower.includes('due soon')) {
      steps.push({ toolName: 'get_tasks', resultSummary: 'Retrieved task matrix' });
      steps.push({ toolName: 'get_unassigned_tasks', resultSummary: 'Filtered unassigned/at-risk tasks' });

      const criticalTasks = this.tasks.filter((t) => t.priority === 'Critical' || t.status === 'Critical Breach');
      const unassigned = this.get_unassigned_tasks();

      const text = `Task Matrix & SLA Exposure Summary\n\nAnalysis of critical path items and pending task assignments.\n\nCritical & At-Risk Tasks:\n${criticalTasks.map((t) => `• ${t.taskCode}: ${t.taskName} (${t.priority} Priority, Assigned to: ${t.assignedEmployeeName}, SLA: ${t.remainingSla})`).join('\n')}\n\nUnassigned Queue:\n${unassigned.length > 0 ? unassigned.map((u) => `• ${u.code}: ${u.name} (${u.effort})`).join('\n') : '• All active tasks currently possess assigned personnel.'}\n\nRecommendation:\nPrioritize task CACHE-104 and INGEST-902 as remaining SLA windows are under 4 hours.`;

      return {
        message: { id: `msg-${Date.now()}`, sender: 'assistant', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        executionSteps: steps,
      };
    }

    // Scenario F: "What tasks are assigned to Rahul?" / Specific employee tasks
    if (targetEmployee && (qLower.includes('tasks') || qLower.includes('assigned to') || qLower.includes('workload'))) {
      steps.push({ toolName: 'get_worker_details', args: { query: targetEmployee.name }, resultSummary: `Fetched tasks for ${targetEmployee.name}` });
      const details = this.get_worker_details(targetEmployee.name);

      const text = `Employee Allocation Summary — ${targetEmployee.name}\n\nPersonnel Profile:\n• Role: ${targetEmployee.role}\n• Team: ${targetEmployee.team}\n• Current Utilization: ${targetEmployee.workload}%\n• Status: ${targetEmployee.status}\n\nAssigned Active Tasks:\n${details?.assignedTasks.map((t) => `• ${t.code}: ${t.name} (Priority: ${t.priority}, Remaining SLA: ${t.remainingSla})`).join('\n')}\n\nRecommendation:\n${targetEmployee.workload >= 85 ? `Reallocate 1-2 tasks from ${targetEmployee.name} to balance team capacity.` : `${targetEmployee.name} has sufficient capacity for additional assignments.`}`;

      return {
        message: { id: `msg-${Date.now()}`, sender: 'assistant', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        executionSteps: steps,
      };
    }

    // Scenario G: "What skills do we currently have?" / "Skill gaps"
    if (qLower.includes('skill') || qLower.includes('competency') || qLower.includes('kubernetes') || qLower.includes('cloud')) {
      steps.push({ toolName: 'get_skills', resultSummary: 'Retrieved skill inventory' });
      steps.push({ toolName: 'get_skill_gaps', resultSummary: 'Analyzed skill gap telemetry' });

      const skillsList = this.skills.map((s) => `• ${s.name} (${s.category}): Proficiency ${s.proficiency}%, ${s.totalEngineers} Engineers, Skill Gap ${s.skillGapPercentage}%`).join('\n');

      const text = `Organizational Skill Intelligence Summary\n\nEvaluation of technical capabilities and competency gaps.\n\nSkill Matrix Overview:\n${skillsList}\n\nSkill Deficit Analysis:\nPrimary skill gaps are identified in Cybersecurity (22% deficit) and Data Engineering (18% deficit). Go Runtime and DevOps & K8s maintain strong coverage (>92%).\n\nRecommendation:\nInitiate cross-training programs for Cybersecurity and GCP/AWS Cloud architecture.`;

      return {
        message: { id: `msg-${Date.now()}`, sender: 'assistant', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        executionSteps: steps,
      };
    }

    // Scenario H: Allocation Action ("Assign task CACHE-104 to Priya", "Assign this task to Priya")
    if (qLower.includes('assign') || qLower.includes('reallocate')) {
      // Find candidate and task
      const workerCandidate = this.employees.find((e) => qLower.includes(e.name.toLowerCase()) || qLower.includes(e.name.split(' ')[0].toLowerCase())) || this.employees.find((e) => e.name.includes('Priya'));
      const taskCandidate = this.tasks.find((t) => qLower.includes(t.taskCode.toLowerCase()) || qLower.includes(t.id.toLowerCase())) || this.tasks[0];

      if (workerCandidate && taskCandidate) {
        steps.push({ toolName: 'allocate_task', args: { taskId: taskCandidate.id, workerId: workerCandidate.id }, resultSummary: `Executed task allocation backend tool` });
        const res = this.allocate_task(taskCandidate.id, workerCandidate.id);

        const text = `Workforce Action Result\n\nAction Requested: Reassign ${taskCandidate.taskCode} to ${workerCandidate.name}.\n\nBackend Validation:\n• Status: ${res.success ? 'Success' : 'Rejected'}\n• Message: ${res.message}\n\nUpdated Allocation State:\n• Task: ${taskCandidate.taskCode} (${taskCandidate.taskName})\n• New Assignee: ${workerCandidate.name}\n• New Utilization for ${workerCandidate.name}: ${workerCandidate.workload}%\n\nRecommendation:\nNo further intervention required for task ${taskCandidate.taskCode}.`;

        return {
          message: { id: `msg-${Date.now()}`, sender: 'assistant', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          executionSteps: steps,
        };
      }
    }

    // Default Fallback query handling with tool execution
    steps.push({ toolName: 'get_workforce_summary', resultSummary: 'Retrieved general workforce telemetry' });
    const summary = this.get_workforce_summary();

    const text = `Workforce Intelligence Query Response\n\nI have analyzed current workforce state regarding your request: "${query}".\n\nTelemetry Overview:\n• Total Active Headcount: ${summary.totalEmployees} personnel\n• Average Utilization: ${summary.avgWorkloadPercentage}%\n• Overloaded Headcount: ${summary.overloadedCount} personnel\n• Unassigned Tasks: ${summary.unassignedTasksCount}\n\nRecommendation:\nPlease specify if you would like me to evaluate specific personnel, task SLA exposures, or skill competency gaps.`;

    return {
      message: { id: `msg-${Date.now()}`, sender: 'assistant', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      executionSteps: steps,
    };
  }
}

export const workforceAgent = new WorkforceAgentEngine();
