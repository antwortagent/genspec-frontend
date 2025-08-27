import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { voiceApi } from '@/api/services';
export const VoiceModelInspector = () => {
    const { projectId } = useParams();
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchSessionDetails = async () => {
        if (!projectId) {
            setError('No project ID available');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // Try both endpoints to see what we get
            const openaiRes = await voiceApi.openaiSession({ project_id: projectId });
            setResponse({
                endpoint: '/api/voice/openai/session',
                data: openaiRes,
                timestamp: new Date().toISOString()
            });
        }
        catch (e) {
            try {
                // Try generic session endpoint
                const genericRes = await voiceApi.createSession({ project_id: projectId, mode: 'gemini_ws' });
                setResponse({
                    endpoint: '/api/voice/session',
                    data: genericRes,
                    timestamp: new Date().toISOString()
                });
            }
            catch (e2) {
                setError(`Both endpoints failed:\n1. OpenAI: ${e?.message}\n2. Generic: ${e2?.message}`);
            }
        }
        finally {
            setLoading(false);
        }
    };
    const extractModelInfo = () => {
        if (!response?.data)
            return null;
        const data = response.data;
        const modelInfo = {
            provider: data.provider,
            provider_url: data.provider_url,
            model_from_url: data.provider_url?.match(/model=([^&]+)/)?.[1],
            provider_parameters: data.instructions?.provider_parameters,
            model_from_params: data.instructions?.provider_parameters?.model ||
                data.instructions?.provider_parameters?.provider_model,
            audio_config: data.audio,
            persona_config: data.persona,
            session_flow: data.session_flow,
        };
        return modelInfo;
    };
    const modelInfo = extractModelInfo();
    return (_jsxs("div", { style: { padding: '20px', maxWidth: '800px', margin: '0 auto' }, children: [_jsx("h2", { children: "Voice Model Inspector" }), _jsxs("p", { children: ["Current project: ", projectId || 'None'] }), _jsx("button", { onClick: fetchSessionDetails, disabled: loading || !projectId, style: {
                    padding: '10px 20px',
                    marginBottom: '20px',
                    backgroundColor: loading ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                }, children: loading ? 'Fetching...' : 'Fetch Voice Session Details' }), error && (_jsxs("div", { style: {
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    whiteSpace: 'pre-line'
                }, children: [_jsx("strong", { children: "Error:" }), " ", error] })), modelInfo && (_jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("h3", { children: "\uD83D\uDCCA Model Information Summary" }), _jsx("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: _jsxs("tbody", { children: [_jsxs("tr", { style: { borderBottom: '1px solid #ddd' }, children: [_jsx("td", { style: { padding: '8px', fontWeight: 'bold' }, children: "Provider:" }), _jsx("td", { style: { padding: '8px' }, children: modelInfo.provider || 'Not specified' })] }), _jsxs("tr", { style: { borderBottom: '1px solid #ddd' }, children: [_jsx("td", { style: { padding: '8px', fontWeight: 'bold' }, children: "Model (from URL):" }), _jsx("td", { style: { padding: '8px', fontFamily: 'monospace' }, children: modelInfo.model_from_url || 'Not found in URL' })] }), _jsxs("tr", { style: { borderBottom: '1px solid #ddd' }, children: [_jsx("td", { style: { padding: '8px', fontWeight: 'bold' }, children: "Model (from params):" }), _jsx("td", { style: { padding: '8px', fontFamily: 'monospace' }, children: modelInfo.model_from_params || 'Not found in parameters' })] }), _jsxs("tr", { style: { borderBottom: '1px solid #ddd' }, children: [_jsx("td", { style: { padding: '8px', fontWeight: 'bold' }, children: "Provider URL:" }), _jsx("td", { style: { padding: '8px', fontFamily: 'monospace', fontSize: '12px' }, children: modelInfo.provider_url || 'Not specified' })] }), _jsxs("tr", { style: { borderBottom: '1px solid #ddd' }, children: [_jsx("td", { style: { padding: '8px', fontWeight: 'bold' }, children: "Session Flow:" }), _jsx("td", { style: { padding: '8px' }, children: modelInfo.session_flow || 'Not specified' })] }), _jsxs("tr", { style: { borderBottom: '1px solid #ddd' }, children: [_jsx("td", { style: { padding: '8px', fontWeight: 'bold' }, children: "Audio Config:" }), _jsx("td", { style: { padding: '8px' }, children: modelInfo.audio_config ? JSON.stringify(modelInfo.audio_config) : 'Not specified' })] })] }) })] })), response && (_jsxs("div", { children: [_jsx("h3", { children: "\uD83D\uDD0D Full API Response" }), _jsxs("div", { style: { fontSize: '12px', color: '#666', marginBottom: '10px' }, children: ["Endpoint: ", _jsx("code", { children: response.endpoint }), " | Fetched: ", new Date(response.timestamp).toLocaleString()] }), _jsx("pre", { style: {
                            backgroundColor: '#f8f9fa',
                            padding: '15px',
                            borderRadius: '4px',
                            overflow: 'auto',
                            maxHeight: '400px',
                            fontSize: '12px'
                        }, children: JSON.stringify(response.data, null, 2) })] }))] }));
};
