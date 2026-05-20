import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export const useCreateOpportunity = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/opportunities', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries(['opportunities']),
  });
};

export const useOpportunities = (params: Record<string, any>) => {
  return useQuery(['opportunities', params], () => api.get('/opportunities', { params }).then((r) => r.data), {
    keepPreviousData: true,
  });
};

export const useOpportunityDetail = (id?: string) => {
  return useQuery(['opportunity', id], () => api.get(`/opportunities/${id}`).then((r) => r.data), {
    enabled: Boolean(id),
  });
};

export const useApplyOpportunity = (opportunityId?: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post(`/opportunities/${opportunityId}/apply`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries(['opportunities', opportunityId]),
  });
};

export const useListOpportunitiesFetcher = (params = {}) => {
  return api.get('/opportunities', { params }).then((r) => r.data);
};
