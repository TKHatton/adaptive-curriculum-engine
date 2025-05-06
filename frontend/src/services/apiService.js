import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiService = {
  // Voice upload endpoint
  uploadVoice: async (file) => {
    const formData = new FormData();
    formData.append('voice', file);
    
    return api.post('/voice/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Content processing endpoint
  processContent: async (data) => {
    return api.post('/content/process', data);
  },

  // Script generation endpoint
  generateScript: async (data) => {
    return api.post('/script/generate', data);
  },

  // Script update endpoint
  updateScript: async (scriptId, content) => {
    return api.put(`/script/${scriptId}`, { content });
  },

  // Slide generation endpoint
  generateSlides: async (scriptId) => {
    return api.post('/slides/generate', { scriptId });
  },

  // Health check endpoint
  healthCheck: async () => {
    return api.get('/health');
  },
};

export default apiService;