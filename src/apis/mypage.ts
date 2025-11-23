import { instance } from './instance';
import type {
  UserInfoResponse,
  CompanyInfoResponse,
  UpdateUserInfoRequest,
  UpdateUserInfoResponse,
  UserPostsResponse,
} from '@/types/mypage';
import type { BookmarkedApplicantsResponse, BookmarkToggleResponse } from '@/types/company';

export const mypageApi = {
  getUserInfo: async (): Promise<UserInfoResponse | CompanyInfoResponse> => {
    const response = await instance.get('/mypage/info');
    return response.data;
  },

  updateUserInfo: async (data: UpdateUserInfoRequest): Promise<UpdateUserInfoResponse> => {
    const response = await instance.patch('/mypage/update', data);
    return response.data;
  },

  getUserPosts: async (): Promise<UserPostsResponse> => {
    const response = await instance.get('/mypage/posts');
    return response.data;
  },

  getBookmarkedApplicants: async (page = 1, limit = 20): Promise<BookmarkedApplicantsResponse> => {
    const response = await instance.get(`/mypage/bookmarked?page=${page}&limit=${limit}`);
    return response.data;
  },

  toggleBookmarkApplicant: async (applicantId: string): Promise<BookmarkToggleResponse> => {
    const response = await instance.post(`/mypage/bookmark/${applicantId}`);
    return response.data;
  },
};
