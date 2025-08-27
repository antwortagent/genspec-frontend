import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { voiceApi } from '@/api/services';

export const VoiceModelInspector: React.FC = () => {
  const { projectId } = useParams();
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (e: any) {
      try {
        // Try generic session endpoint
        const genericRes = await voiceApi.createSession({ project_id: projectId, mode: 'gemini_ws' });
        setResponse({
          endpoint: '/api/voice/session',
          data: genericRes,
          timestamp: new Date().toISOString()
        });
      } catch (e2: any) {
        setError(`Both endpoints failed:\n1. OpenAI: ${e?.message}\n2. Generic: ${e2?.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const extractModelInfo = () => {
    if (!response?.data) return null;
    
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

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Voice Model Inspector</h2>
      <p>Current project: {projectId || 'None'}</p>
      
      <button 
        onClick={fetchSessionDetails}
        disabled={loading || !projectId}
        style={{ 
          padding: '10px 20px', 
          marginBottom: '20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Fetching...' : 'Fetch Voice Session Details'}
      </button>

      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px',
          whiteSpace: 'pre-line'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {modelInfo && (
        <div style={{ marginBottom: '20px' }}>
          <h3>📊 Model Information Summary</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Provider:</td>
                <td style={{ padding: '8px' }}>{modelInfo.provider || 'Not specified'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Model (from URL):</td>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>
                  {modelInfo.model_from_url || 'Not found in URL'}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Model (from params):</td>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>
                  {modelInfo.model_from_params || 'Not found in parameters'}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Provider URL:</td>
                <td style={{ padding: '8px', fontFamily: 'monospace', fontSize: '12px' }}>
                  {modelInfo.provider_url || 'Not specified'}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Session Flow:</td>
                <td style={{ padding: '8px' }}>{modelInfo.session_flow || 'Not specified'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Audio Config:</td>
                <td style={{ padding: '8px' }}>
                  {modelInfo.audio_config ? JSON.stringify(modelInfo.audio_config) : 'Not specified'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {response && (
        <div>
          <h3>🔍 Full API Response</h3>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
            Endpoint: <code>{response.endpoint}</code> | 
            Fetched: {new Date(response.timestamp).toLocaleString()}
          </div>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px',
            fontSize: '12px'
          }}>
            {JSON.stringify(response.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
