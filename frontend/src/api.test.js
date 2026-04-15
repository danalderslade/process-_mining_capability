const mockGet = jest.fn();

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: mockGet,
  })),
}));

const { fetchDashboard, fetchCases, fetchCaseTransitions, fetchFilters } = require('./api');

beforeEach(() => {
  mockGet.mockClear();
});

describe('api module', () => {
  describe('fetchDashboard', () => {
    it('calls GET /dashboard without params when no filters', async () => {
      const data = { totalCases: 10, statusCounts: [] };
      mockGet.mockResolvedValue({ data });

      const result = await fetchDashboard();

      expect(mockGet).toHaveBeenCalledWith('/dashboard', { params: {} });
      expect(result).toEqual(data);
    });

    it('passes filter params when provided', async () => {
      mockGet.mockResolvedValue({ data: {} });

      await fetchDashboard({ caseTypeId: 1, countryId: 2, lineOfBusiness: 'RETAIL' });

      expect(mockGet).toHaveBeenCalledWith('/dashboard', {
        params: { caseTypeId: 1, countryId: 2, lineOfBusiness: 'RETAIL' },
      });
    });

    it('ignores falsy filter values', async () => {
      mockGet.mockResolvedValue({ data: {} });

      await fetchDashboard({ caseTypeId: null, countryId: undefined });

      expect(mockGet).toHaveBeenCalledWith('/dashboard', { params: {} });
    });

    it('throws with user-friendly message on error', async () => {
      mockGet.mockRejectedValue({
        response: { data: { error: 'Invalid request parameters' } },
      });

      await expect(fetchDashboard()).rejects.toThrow('Invalid request parameters');
    });

    it('throws generic message when no response body', async () => {
      mockGet.mockRejectedValue(new Error('Network Error'));

      await expect(fetchDashboard()).rejects.toThrow('Network Error');
    });
  });

  describe('fetchCases', () => {
    it('calls GET /cases and returns data', async () => {
      const data = [{ id: 1, caseReference: 'FC-001' }];
      mockGet.mockResolvedValue({ data });

      const result = await fetchCases();

      expect(mockGet).toHaveBeenCalledWith('/cases', { params: {} });
      expect(result).toEqual(data);
    });

    it('passes filters correctly', async () => {
      mockGet.mockResolvedValue({ data: [] });

      await fetchCases({ lineOfBusiness: 'COMMERCIAL' });

      expect(mockGet).toHaveBeenCalledWith('/cases', {
        params: { lineOfBusiness: 'COMMERCIAL' },
      });
    });
  });

  describe('fetchCaseTransitions', () => {
    it('calls GET /cases/{id}/transitions with encoded caseId', async () => {
      const data = [{ fromStatus: 'NEW', toStatus: 'UNDER_INVESTIGATION' }];
      mockGet.mockResolvedValue({ data });

      const result = await fetchCaseTransitions(42);

      expect(mockGet).toHaveBeenCalledWith('/cases/42/transitions');
      expect(result).toEqual(data);
    });
  });

  describe('fetchFilters', () => {
    it('calls GET /filters and returns options', async () => {
      const data = {
        caseTypes: [{ id: 1, name: 'Fraud' }],
        countries: [{ id: 1, name: 'UK' }],
        linesOfBusiness: ['RETAIL', 'COMMERCIAL'],
      };
      mockGet.mockResolvedValue({ data });

      const result = await fetchFilters();

      expect(mockGet).toHaveBeenCalledWith('/filters');
      expect(result).toEqual(data);
    });
  });
});
