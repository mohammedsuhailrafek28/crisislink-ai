import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export const useFeed = () => {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam = 1 }) =>
      api.get(`/feed?page=${pageParam}&limit=20`).then((r) => r.data),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
};

export const useCreatePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { content: string; mediaUrl?: string; mediaType?: 'image' | 'video' }) =>
      api.post('/feed', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};

export const useLikePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) =>
      api.post(`/feed/${postId}/like`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};

export const useUnlikePost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) =>
      api.post(`/feed/${postId}/unlike`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};
