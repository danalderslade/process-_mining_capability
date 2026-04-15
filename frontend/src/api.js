import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

export const fetchDashboard = (filters = {}) => {
  const params = {};
  if (filters.caseTypeId) params.caseTypeId = filters.caseTypeId;
  if (filters.countryId) params.countryId = filters.countryId;
  if (filters.lineOfBusiness) params.lineOfBusiness = filters.lineOfBusiness;
  return api.get('/dashboard', { params }).then(res => res.data);
};

export const fetchCases = (filters = {}) => {
  const params = {};
  if (filters.caseTypeId) params.caseTypeId = filters.caseTypeId;
  if (filters.countryId) params.countryId = filters.countryId;
  if (filters.lineOfBusiness) params.lineOfBusiness = filters.lineOfBusiness;
  return api.get('/cases', { params }).then(res => res.data);
};

export const fetchCaseTransitions = (caseId) => {
  return api.get(`/cases/${encodeURIComponent(caseId)}/transitions`).then(res => res.data);
};

export const fetchFilters = () => {
  return api.get('/filters').then(res => res.data);
};

export default api;
