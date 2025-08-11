import { api } from './client';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  type?: string;
  template_id?: string;
}

export const projectsApi = {
  // Get all projects for the current user
  getProjects: async (): Promise<Project[]> => {
    return api<Project[]>('/projects');
  },

  // Get a specific project by ID
  getProject: async (id: string): Promise<Project> => {
    return api<Project>(`/projects/${id}`);
  },

  // Create a new project
  createProject: async (data: CreateProjectRequest): Promise<Project> => {
    return api<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update a project
  updateProject: async (id: string, data: Partial<CreateProjectRequest>): Promise<Project> => {
    return api<Project>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete a project
  deleteProject: async (id: string): Promise<void> => {
    return api<void>(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

// Chat/AI API
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  message: string;
  context?: string;
  project_id?: string;
  history?: ChatMessage[];
}

export interface ChatCompletionResponse {
  message: string;
  suggestions?: string[];
}

export const chatApi = {
  // Send a message to the AI assistant
  sendMessage: async (data: ChatCompletionRequest): Promise<ChatCompletionResponse> => {
    return api<ChatCompletionResponse>('/chat/completion', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get chat history for a project
  getChatHistory: async (projectId: string): Promise<ChatMessage[]> => {
    return api<ChatMessage[]>(`/projects/${projectId}/chat/history`);
  },
};

// Analytics API
export interface DashboardAnalytics {
  projects: {
    total: number;
    active: number;
    completed: number;
    draft: number;
  };
  specifications: {
    total_generated: number;
    this_month: number;
    average_time_saved_hours: number;
  };
  team: {
    total_members: number;
    active_collaborators: number;
  };
  usage: {
    ai_messages_sent: number;
    projects_created_this_month: number;
    time_saved_total_hours: number;
  };
}

export interface RecentProject {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  updated_at: string;
  progress_percentage?: number;
}

export const analyticsApi = {
  // Get dashboard analytics summary
  getDashboardAnalytics: async (): Promise<DashboardAnalytics> => {
    return api<DashboardAnalytics>('/analytics/dashboard');
  },

  // Get recent projects for dashboard
  getRecentProjects: async (limit: number = 5): Promise<RecentProject[]> => {
    return api<RecentProject[]>(`/analytics/recent-projects?limit=${limit}`);
  },

  // Get user activity summary
  getUserActivity: async (days: number = 30): Promise<any> => {
    return api<any>(`/analytics/user-activity?days=${days}`);
  },
};
