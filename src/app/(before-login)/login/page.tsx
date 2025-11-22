'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { UserRole, LOCAL_STORAGE_KEYS } from '@/constants/local-storage';
import { KoreaMajorCity } from '@/constants/korea-major-city';
import { User, Briefcase, Lock, ArrowLeft, MapPinned } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoginFormData {
  id: string;
  password: string;
  name: string;
}

interface LoginResponse {
  success: boolean;
  pid: string;
  message?: string;
}

const IS_DEV = process.env.NODE_ENV === 'development';

const ROLE_BUTTON_TEXT = {
  USER: {
    title: '구직자',
    description: '일자리를 찾는 개인',
  },
  COMPANY: {
    title: '기업',
    description: '인재를 채용하는 기업',
  },
};

const BASE_URL = {
  LOGIN: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
  SIGNUP: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
};

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const [selectedRole, setSelectedRole] = useState<UserRole>('USER');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [loginMode, setLoginMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  const onSubmit = async (data: LoginFormData) => {
    try {
      // 폼 데이터와 선택된 Role을 합쳐서 전송
      const requestBody = {
        loginId: data.id,
        password: data.password,
        role: selectedRole,
        displayName: data.name,
        // city: selectedCity,
      };

      const response = await fetch(BASE_URL[loginMode], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include',
      });

      if (response.ok) {
        const responseData: LoginResponse = await response.json();
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ROLE, selectedRole);
        if (responseData.pid) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.PID, responseData.pid);
        }

        // 메인으로 이동
        router.push('/');
      } else {
        alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div
      className={cn(
        'min-h-screen bg-white flex flex-col items-center px-6 pt-12 pb-6 mx-auto w-full',
        'no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
      )}
    >
      {/* 헤더 (뒤로가기 및 타이틀) */}
      <div className="w-full flex items-center mb-8 relative">
        <button onClick={() => router.back()} className="absolute left-0 p-2">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* 타이틀 섹션 */}
      <div className="w-full text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">로그인</h1>
        <p className="text-gray-500">마지막 단계만 남았습니다!</p>
      </div>

      {/* 역할 선택 카드 섹션 */}
      <div className="flex gap-4 w-full mb-8">
        {/* 구직자 카드 */}
        <RoleCard role="USER" selectedRole={selectedRole} onSelect={setSelectedRole} />

        {/* 기업 카드 */}
        <RoleCard role="COMPANY" selectedRole={selectedRole} onSelect={setSelectedRole} />
      </div>

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
        {/* 회원 ID */}
        <div>
          <label className="block text-gray-800 text-sm font-medium mb-2">회원 ID</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('id', { required: true })}
              type="text"
              placeholder="아이디를 입력해주세요"
              className={cn(
                'w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg',
                'focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition-colors',
              )}
            />
          </div>
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="block text-gray-800 text-sm font-medium mb-2">비밀번호</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('password', { required: true })}
              type="password"
              placeholder="••••••••"
              className={cn(
                'w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg',
                'focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition-colors',
              )}
            />
          </div>
        </div>

        {/* 이름 */}
        <div>
          <label className="block text-gray-800 text-sm font-medium mb-2">이름</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('name')}
              type="text"
              placeholder="김동국"
              className={cn(
                'w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg',
                'focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition-colors',
              )}
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-800 text-sm font-medium mb-2">
            {selectedRole === 'USER' ? '희망 근무지' : '회사 위치'}
          </label>
          <div className="relative w-full">
            <MapPinned className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full pl-10 pr-4 py-3">
                <SelectValue placeholder="지역을 선택해주세요" />
              </SelectTrigger>

              <SelectContent>
                {Object.entries(KoreaMajorCity).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 디버깅용 출력 */}
          {IS_DEV && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
              선택된 값(백엔드 전송용): <strong>{selectedCity}</strong>
            </div>
          )}
        </div>

        {/* 로그인 버튼 */}
        <div className="pt-4 space-y-4">
          <button
            type="submit"
            className={cn(
              'w-full bg-gray-900 text-white font-bold py-4 px-4 rounded-lg',
              'hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900',
            )}
          >
            로그인
          </button>
          <button
            type="submit"
            className={cn(
              'w-full bg-gray-700 text-white font-bold py-4 px-4 rounded-lg',
              'hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900',
            )}
          >
            회원가입
          </button>
          {/* <button
            onClick={() => router.push('/shorts')}
            className="w-full text-gray-900 border border-gray-200 font-bold py-4 px-4 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            로그인 하지 않고 둘러보기
          </button> */}
        </div>
      </form>
    </div>
  );
}

function RoleCard({
  role,
  selectedRole,
  onSelect,
}: {
  role: UserRole;
  selectedRole: UserRole;
  onSelect: (role: UserRole) => void;
}) {
  const isSelected = role === selectedRole;

  return (
    <button
      type="button"
      onClick={() => onSelect(role)}
      className={`flex-1 flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 ${
        isSelected
          ? 'border-gray-800 bg-gray-50 shadow-sm'
          : 'border-gray-200 bg-white text-gray-400'
      }`}
    >
      <div className={`p-3 rounded-full mb-2 ${isSelected ? 'bg-gray-200' : 'bg-gray-100'}`}>
        {role === 'USER' ? (
          <User className={`w-8 h-8 ${isSelected ? 'text-gray-800' : 'text-gray-400'}`} />
        ) : (
          <Briefcase className={`w-8 h-8 ${isSelected ? 'text-gray-800' : 'text-gray-400'}`} />
        )}
      </div>
      <span className={`font-bold text-lg ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>
        {ROLE_BUTTON_TEXT[role].title}
      </span>
      <span className="text-xs text-gray-500 mt-1">{ROLE_BUTTON_TEXT[role].description}</span>
    </button>
  );
}
