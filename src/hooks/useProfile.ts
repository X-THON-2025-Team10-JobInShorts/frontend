'use client';

import { useState, useEffect, useCallback } from 'react';
import { mypageApi } from '@/apis/mypage';
import type { 
  UserInfoResponse, 
  UpdateUserInfoRequest, 
  UpdateUserInfoResponse 
} from '@/types/mypage';

interface UseProfileState {
  profile: UserInfoResponse | null;
  isLoading: boolean;
  error: string | null;
}

export const useProfile = () => {
  const [state, setState] = useState<UseProfileState>({
    profile: null,
    isLoading: false,
    error: null,
  });

  const fetchProfile = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const profile = await mypageApi.getUserInfo();
      setState(prev => ({ ...prev, profile, isLoading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
      setState(prev => ({ 
        ...prev, 
        profile: null, 
        isLoading: false, 
        error: errorMessage 
      }));
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateUserInfoRequest): Promise<UpdateUserInfoResponse | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const updatedProfile = await mypageApi.updateUserInfo(data);
      setState(prev => ({ 
        ...prev, 
        profile: updatedProfile, 
        isLoading: false 
      }));
      return updatedProfile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      return null;
    }
  }, []);

  const resetError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile: state.profile,
    isLoading: state.isLoading,
    error: state.error,
    fetchProfile,
    updateProfile,
    resetError,
  };
};