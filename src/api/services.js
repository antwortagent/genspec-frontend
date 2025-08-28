import { api } from './client';
export const projectsApi = {
    // Get all projects for the current user
    getProjects: async () => {
        return api('/projects');
    },
    // Get a specific project by ID
    getProject: async (id) => {
        return api(`/projects/${id}`);
    },
    // Create a new project
    createProject: async (data) => {
        return api('/projects', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    // Update a project
    updateProject: async (id, data) => {
        return api(`/projects/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
    // Delete a project
    deleteProject: async (id) => {
        return api(`/projects/${id}`, {
            method: 'DELETE',
        });
    },
};
export const chatApi = {
    // Send a message to the AI assistant
    sendMessage: async (data) => {
        return api('/chat/completion', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    // Get chat history for a project
    getChatHistory: async (projectId) => {
        return api(`/projects/${projectId}/chat/history`);
    },
};
export const analyticsApi = {
    // Get dashboard analytics summary
    getDashboardAnalytics: async () => {
        return api('/analytics/dashboard');
    },
    // Get recent projects for dashboard
    getRecentProjects: async (limit = 5) => {
        return api(`/analytics/recent-projects?limit=${limit}`);
    },
    // Get user activity summary
    getUserActivity: async (days = 30) => {
        return api(`/analytics/user-activity?days=${days}`);
    },
};
export const voiceApi = {
    // Initialize realtime session and get provider connection details
    openaiSession: async (data) => {
        return api('/api/voice/openai/session', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    // Generic session creator that supports different modes (e.g., gemini_ws)
    createSession: async (data) => {
        return api('/api/voice/session', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    // Submit transcript segments captured client-side (optional)
    submitTranscripts: async (session_id, segments) => {
        return api('/api/voice/transcripts', {
            method: 'POST',
            body: JSON.stringify({ session_id, segments }),
        });
    },
    // End a realtime session
    endSession: async (session_id) => {
        return api('/api/voice/session/end', {
            method: 'POST',
            body: JSON.stringify({ session_id }),
        });
    },
    // Convenience starter that chooses endpoint based on an `api` parameter
    // Priority: explicit arg > URL ?api= > VITE_VOICE_API > fallback to createSession
    startSession: async (data) => {
        let apiParam = data.api;
        if (!apiParam && typeof window !== 'undefined') {
            try {
                apiParam = new URLSearchParams(window.location.search).get('api') || undefined;
            }
            catch { }
        }
        apiParam = apiParam || import.meta.env?.VITE_VOICE_API;
        const norm = (apiParam || '').toString().toLowerCase();
        // Allow explicit mode override too
        const mode = data.mode || import.meta.env?.VITE_VOICE_MODE;
        if (norm === 'openai' || norm === 'openai_realtime' || norm === 'openai-rt') {
            return voiceApi.openaiSession({ project_id: data.project_id });
        }
        if (norm === 'mesh' || norm === 'gemini_ws' || norm === 'gemini-ws') {
            return voiceApi.createSession({ project_id: data.project_id, mode: 'gemini_ws' });
        }
        if (norm === 'gemini' || norm === 'gemini_realtime' || norm === 'gemini-rt') {
            return voiceApi.createSession({ project_id: data.project_id, mode: 'gemini_realtime' });
        }
        // Fallback: use generic createSession, carry through any explicit mode/env mode
        return voiceApi.createSession({ project_id: data.project_id, ...(mode ? { mode } : {}) });
    },
};
