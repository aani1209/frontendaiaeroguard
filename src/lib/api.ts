/**
 * API Service for AeroGuard AI Frontend
 * Handles all backend API calls for threat detection and countermeasures
 */

// Determine API base URL based on environment
const API_BASE = (() => {
  if (typeof window === 'undefined') return '';
  
  const hostname = window.location.hostname;
  const isDev = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]' || hostname.startsWith('192.168');
  
  if (isDev) {
    // Development: connect to separate backend server on port 5000
    return 'http://localhost:5000';
  }
  
  // Production: same origin (backend serves frontend + API)
  return 'https://archiepiscopally-indiscerptible-kayleigh.ngrok-free.dev';
})();

/**
 * Generic API call function with error handling
 */
async function apiCall(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetch(`${API_BASE}/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * API endpoints
 */
export const api = {
  /**
   * Health check
   */
  health: async () => {
    return apiCall('/health');
  },

  /**
   * Trigger threat response
   * Called when a threat is detected
   */
  trigger: async (data: {
    threat_detected: boolean;
    detection: {
      class_name: string;
      confidence: number;
      bbox: number[];
      timestamp: string;
      threat_level?: string;
    };
  }) => {
    return apiCall('/trigger', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get system status
   */
  getStatus: async () => {
    return apiCall('/status');
  },

  /**
   * Get threat log
   */
  getThreatLog: async () => {
    return apiCall('/threat-log');
  },

  /**
   * Clear threat log
   */
  clearThreatLog: async () => {
    return apiCall('/threat-log', {
      method: 'DELETE',
    });
  },

  /**
   * Deactivate jammer
   */
  deactivateJammer: async () => {
    return apiCall('/jammer/deactivate', {
      method: 'POST',
    });
  },
};

