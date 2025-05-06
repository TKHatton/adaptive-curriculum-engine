import axios from 'axios';

// Get API URL from environment variable or use default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiService = {
  // Content processing endpoint
  processContent: async (formData) => {
    return api.post('/content/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Writing profile endpoints
  saveWritingSamples: async (samples) => {
    return api.post('/writing/samples', { samples });
  },

  getWritingProfile: async (profileId) => {
    return api.get(`/writing/${profileId}`);
  },

  // Script generation endpoints
  generateScript: async (data) => {
    return api.post('/generate/script', data);
  },

  updateScript: async (scriptId, content) => {
    return api.put(`/script/${scriptId}`, { content });
  },

  // Slide generation endpoints
  generateSlides: async (data) => {
    return api.post('/generate/slides', data);
  },

  // Health check endpoint
  healthCheck: async () => {
    return api.get('/health');
  },
};

export default apiService;