'use client';

import { ApplicantProfilePage } from '@/components/mypage/ApplicantProfilePage';
import { CompanyProfilePage } from '@/components/mypage/CompanyProfilePage';
import { useMypage, useUserPosts, useBookmarkedApplicants } from '@/hooks/useMypage';
import type { CompanyInfoResponse, UserInfoResponse } from '@/types/mypage';
import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage';

export default function ProfilePage() {
  const [pid, setPid] = useState<string>('');
  const { user, isLoading, error, isCompany } = useMypage(pid);
  const userPostsQuery = useUserPosts('mypage', pid);

  const bookmarkedQuery = useBookmarkedApplicants(pid);

  useEffect(() => {
    const storedPid = localStorage.getItem(LOCAL_STORAGE_KEYS.PID);
    if (storedPid) {
      // eslint-disable-next-line
      setPid(storedPid);
    }
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white flex justify-center">
        <div className="w-full max-w-md bg-white border-x border-gray-100 shadow-sm min-h-screen flex flex-col">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-gray-500">프로필을 불러오는 중...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white flex justify-center">
        <div className="w-full max-w-md bg-white border-x border-gray-100 shadow-sm min-h-screen flex flex-col">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-500 mb-2">프로필을 불러올 수 없습니다.</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-md bg-white border-x border-gray-100 shadow-sm min-h-screen flex flex-col">
        {isCompany ? (
          <CompanyProfilePage
            company={{
              name: (user as CompanyInfoResponse).companyName || user.displayName || user.username,
              username: user.username,
              description: user.bio || '회사 소개가 없습니다.',
              location: (user as CompanyInfoResponse).location || '위치 정보 없음',
              email: (user as CompanyInfoResponse).contactEmail || user.email,
              avatar: user.profileImageUrl || '/temp-profile.avif',
              jobPostings: (user as CompanyInfoResponse).stats?.jobPostings || 0,
              followers: (user as CompanyInfoResponse).stats?.followers || 0,
            }}
            bookmarkedApplicants={bookmarkedQuery?.data?.data || undefined}
          />
        ) : (
          <ApplicantProfilePage
            profile={user as UserInfoResponse}
            posts={userPostsQuery.data?.posts || []}
          />
        )}
      </div>
    </main>
  );
}
