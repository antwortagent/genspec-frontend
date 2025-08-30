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
  requirements_count?: number;
  team_members?: Array<{
    id: string;
    name: string;
    email: string;
  }>;
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

// Voice API
export type ProviderName = 'openai' | 'gemini' | 'openai_realtime' | 'gemini_realtime' | 'gemini_ws';
export type IceServer = { urls: string | string[]; username?: string; credential?: string };

export interface VoiceSessionRequest {
  project_id: string;
}

export interface VoiceInstructions {
  system_prompt: string;
  tools: any[]; // tool JSON schemas verbatim
  provider_parameters: Record<string, any>;
}

export interface VoiceSessionResponse {
  session_id: string;
  provider: ProviderName;
  session_flow: 'https_sdp_direct' | 'websocket_mesh' | 'webrtc_https' | string;
  provider_url: string;
  token: string | null;
  // Optional auth header customization (e.g., X-Goog-Api-Key for Gemini)
  token_header?: string | null; // default: Authorization
  token_scheme?: string | null; // default: Bearer (used only with Authorization)
  audio?: { sampleRate: number; encoding: 'pcm16' | 'opus' | 'webm_opus' | 'mp3' } | null;
  persona?: Record<string, any> | null;
  iceServers: IceServer[] | null;
  instructions: VoiceInstructions;
}

export interface TranscriptSegment {
  speaker: 'user' | 'assistant' | string;
  text: string;
  start_ms?: number;
  end_ms?: number;
  correlation_id?: string;
}

export const voiceApi = {
  // Initialize realtime session and get provider connection details
  openaiSession: async (data: VoiceSessionRequest): Promise<VoiceSessionResponse> => {
    return api<VoiceSessionResponse>('/api/voice/openai/session', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Generic session creator that supports different modes (e.g., gemini_ws)
  createSession: async (data: VoiceSessionRequest & { mode?: string }): Promise<VoiceSessionResponse> => {
    return api<VoiceSessionResponse>('/api/voice/session', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Submit transcript segments captured client-side (optional)
  submitTranscripts: async (session_id: string, segments: TranscriptSegment[]): Promise<{ ok: true }> => {
    return api<{ ok: true }>('/api/voice/transcripts', {
      method: 'POST',
      body: JSON.stringify({ session_id, segments }),
    });
  },

  // End a realtime session
  endSession: async (session_id: string): Promise<{ ok: true }> => {
    return api<{ ok: true }>('/api/voice/session/end', {
      method: 'POST',
      body: JSON.stringify({ session_id }),
    });
  },

  // Convenience starter that chooses endpoint based on an `api` parameter
  // Priority: explicit arg > URL ?api= > VITE_VOICE_API > fallback to createSession
  startSession: async (
    data: VoiceSessionRequest & { api?: string; mode?: string }
  ): Promise<VoiceSessionResponse> => {
    let apiParam = data.api;
    if (!apiParam && typeof window !== 'undefined') {
      try { apiParam = new URLSearchParams(window.location.search).get('api') || undefined; } catch {}
    }
    apiParam = apiParam || (import.meta as any).env?.VITE_VOICE_API;
    const norm = (apiParam || '').toString().toLowerCase();

    // Allow explicit mode override too
    const mode = data.mode || (import.meta as any).env?.VITE_VOICE_MODE;

    if (norm === 'openai' || norm === 'openai_realtime' || norm === 'openai-rt') {
      return voiceApi.openaiSession({ project_id: data.project_id });
    }

    if (norm === 'mesh' || norm === 'gemini_ws' || norm === 'gemini-ws') {
      return voiceApi.createSession({ project_id: data.project_id, mode: 'gemini_ws' } as any);
    }

    if (norm === 'gemini' || norm === 'gemini_realtime' || norm === 'gemini-rt') {
      return voiceApi.createSession({ project_id: data.project_id, mode: 'gemini_realtime' } as any);
    }

    // Fallback: use generic createSession, carry through any explicit mode/env mode
    return voiceApi.createSession({ project_id: data.project_id, ...(mode ? { mode } : {}) } as any);
  },
};
