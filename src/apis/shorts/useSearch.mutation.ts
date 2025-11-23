import { instance } from '../instance';
import { useMutation } from '@tanstack/react-query';
import { Shorts } from './dto.types';
import { ShortsSchema } from './dto.schemas';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage';

async function searchShorts({
  searchQuery,
  pageParam,
}: {
  searchQuery: string;
  pageParam?: string | null;
}) {
  const currentUserPid = localStorage.getItem(LOCAL_STORAGE_KEYS.PID);

  const res = await instance.post<Shorts>(`/api/short-forms/search`, {
    query: searchQuery,
    size: 20,
    currentUserPid,
    ...(pageParam ? { pageParam } : {}),
  });
  const parsed = ShortsSchema.safeParse(res.data);
  if (!parsed.success) {
    throw new Error(`숏츠 검색 쿼리(${searchQuery}) 응답 파싱 실패, 타입이 일치하지 않습니다.`);
  }

  return parsed.data;
}

export function useShorts(searchQuery: string, pageParam?: string | null) {
  return useMutation<Shorts>({
    mutationKey: ['short-form', searchQuery],
    mutationFn: () => searchShorts({ searchQuery, pageParam }),
  });
}
