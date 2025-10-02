import api from './authService';

// API service for managing offers, needs, and connections
export const postService = {
  // Offers API
  async createOffer(offerData) {
    try {
      const response = await api.post('/offers', offerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create offer');
    }
  },

  async getOffers(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/offers?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch offers');
    }
  },

  async getOffer(offerId) {
    try {
      const response = await api.get(`/offers/${offerId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch offer');
    }
  },

  async updateOffer(offerId, offerData) {
    try {
      const response = await api.put(`/offers/${offerId}`, offerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update offer');
    }
  },

  async deleteOffer(offerId) {
    try {
      const response = await api.delete(`/offers/${offerId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete offer');
    }
  },

  // Needs API
  async createNeed(needData) {
    try {
      const response = await api.post('/needs', needData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create need');
    }
  },

  async getNeeds(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/needs?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch needs');
    }
  },

  async getNeed(needId) {
    try {
      const response = await api.get(`/needs/${needId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch need');
    }
  },

  async updateNeed(needId, needData) {
    try {
      const response = await api.put(`/needs/${needId}`, needData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update need');
    }
  },

  async deleteNeed(needId) {
    try {
      const response = await api.delete(`/needs/${needId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete need');
    }
  },

  // Connections API
  async createConnection(connectionData) {
    try {
      const response = await api.post('/connections', connectionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create connection');
    }
  },

  async getConnections(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/connections?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch connections');
    }
  },

  async getConnection(connectionId) {
    try {
      const response = await api.get(`/connections/${connectionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch connection');
    }
  },

  async updateConnection(connectionId, connectionData) {
    try {
      const response = await api.put(`/connections/${connectionId}`, connectionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update connection');
    }
  },

  async deleteConnection(connectionId) {
    try {
      const response = await api.delete(`/connections/${connectionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete connection');
    }
  },

  // Matching API
  async getMatches(postId, postType) {
    try {
      const response = await api.get(`/matches/${postType}/${postId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch matches');
    }
  },

  async connectToPost(postId, postType, message = '') {
    try {
      const response = await api.post('/connections/connect', {
        postId,
        postType,
        message
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to connect to post');
    }
  }
};

// Resource types for categorization
export const RESOURCE_TYPES = {
  BLOOD: 'blood',
  MONEY: 'money',
  FOOD: 'food',
  CLOTHING: 'clothing',
  SHELTER: 'shelter',
  MEDICAL: 'medical',
  EDUCATION: 'education',
  TRANSPORTATION: 'transportation',
  EMOTIONAL_SUPPORT: 'emotional_support',
  LEGAL_HELP: 'legal_help',
  CHILDCARE: 'childcare',
  ELDERLY_CARE: 'elderly_care',
  SKILLS: 'skills',
  EQUIPMENT: 'equipment',
  OTHER: 'other'
};

// Resource type display information
export const RESOURCE_TYPE_INFO = {
  [RESOURCE_TYPES.BLOOD]: {
    label: 'Blood Donation',
    icon: '🩸',
    color: '#dc3545',
    description: 'Blood and organ donations'
  },
  [RESOURCE_TYPES.MONEY]: {
    label: 'Financial Aid',
    icon: '💰',
    color: '#28a745',
    description: 'Money, loans, financial assistance'
  },
  [RESOURCE_TYPES.FOOD]: {
    label: 'Food & Nutrition',
    icon: '🍞',
    color: '#fd7e14',
    description: 'Meals, groceries, nutrition support'
  },
  [RESOURCE_TYPES.CLOTHING]: {
    label: 'Clothing & Textiles',
    icon: '👕',
    color: '#6f42c1',
    description: 'Clothes, blankets, textiles'
  },
  [RESOURCE_TYPES.SHELTER]: {
    label: 'Housing & Shelter',
    icon: '🏠',
    color: '#0dcaf0',
    description: 'Temporary housing, shelter'
  },
  [RESOURCE_TYPES.MEDICAL]: {
    label: 'Medical Care',
    icon: '🏥',
    color: '#dc3545',
    description: 'Healthcare, medicine, treatment'
  },
  [RESOURCE_TYPES.EDUCATION]: {
    label: 'Education & Training',
    icon: '📚',
    color: '#0d6efd',
    description: 'Tutoring, courses, skill training'
  },
  [RESOURCE_TYPES.TRANSPORTATION]: {
    label: 'Transportation',
    icon: '🚗',
    color: '#198754',
    description: 'Rides, vehicle assistance'
  },
  [RESOURCE_TYPES.EMOTIONAL_SUPPORT]: {
    label: 'Emotional Support',
    icon: '💙',
    color: '#6610f2',
    description: 'Counseling, companionship'
  },
  [RESOURCE_TYPES.LEGAL_HELP]: {
    label: 'Legal Assistance',
    icon: '⚖️',
    color: '#495057',
    description: 'Legal advice, documentation help'
  },
  [RESOURCE_TYPES.CHILDCARE]: {
    label: 'Childcare',
    icon: '👶',
    color: '#e83e8c',
    description: 'Babysitting, child supervision'
  },
  [RESOURCE_TYPES.ELDERLY_CARE]: {
    label: 'Elderly Care',
    icon: '👴',
    color: '#6c757d',
    description: 'Senior care, companionship'
  },
  [RESOURCE_TYPES.SKILLS]: {
    label: 'Professional Skills',
    icon: '🛠️',
    color: '#20c997',
    description: 'Professional services, expertise'
  },
  [RESOURCE_TYPES.EQUIPMENT]: {
    label: 'Equipment & Tools',
    icon: '🔧',
    color: '#fd7e14',
    description: 'Tools, devices, equipment'
  },
  [RESOURCE_TYPES.OTHER]: {
    label: 'Other',
    icon: '🤝',
    color: '#6c757d',
    description: 'Other types of help'
  }
};

// Urgency levels
export const URGENCY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

export const URGENCY_INFO = {
  [URGENCY_LEVELS.LOW]: {
    label: 'Low Priority',
    color: '#28a745',
    icon: '🟢',
    description: 'Can wait, not time-sensitive'
  },
  [URGENCY_LEVELS.MEDIUM]: {
    label: 'Medium Priority',
    color: '#ffc107',
    icon: '🟡',
    description: 'Moderately important'
  },
  [URGENCY_LEVELS.HIGH]: {
    label: 'High Priority',
    color: '#fd7e14',
    icon: '🟠',
    description: 'Important, needs attention soon'
  },
  [URGENCY_LEVELS.CRITICAL]: {
    label: 'Critical',
    color: '#dc3545',
    icon: '🔴',
    description: 'Urgent, immediate attention needed'
  }
};

export default postService;