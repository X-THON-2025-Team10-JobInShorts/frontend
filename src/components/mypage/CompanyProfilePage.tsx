import { MapPin, Bookmark } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ProfileHeader } from './ProfileHeader';
import { ProfileInfo, type ProfileStat } from './ProfileInfo';
import { ProfileActions } from './ProfileActions';
import type { Applicant } from '@/types/company';

interface CompanyProfilePageProps {
  company?: {
    name: string;
    username: string;
    description: string;
    location: string;
    email: string;
    avatar: string;
    jobPostings: number;
    followers: number;
  };
  bookmarkedApplicants?: Applicant[];
}

export function CompanyProfilePage({
  company = {
    name: '테크 스타트업',
    username: 'techstartup_kr',
    description: '혁신적인 기술로 더 나은 세상을 만듭니다',
    location: '서울시 강남구 테헤란로',
    email: 'recruit@techstartup.com',
    avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop',
    jobPostings: 42,
    followers: 1200,
  },
  bookmarkedApplicants = [
    {
      id: '1',
      name: '김민수',
      position: '프론트엔드 개발자',
      avatar: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?w=200&h=200&fit=crop',
      skills: ['React', 'TypeScript', 'Next.js'],
      experience: '3년',
      location: '서울',
    },
    {
      id: '2',
      name: '이서연',
      position: 'UI/UX 디자이너',
      avatar: 'https://images.unsplash.com/photo-1762341120638-b5b9358ef571?w=200&h=200&fit=crop',
      skills: ['Figma', 'Sketch', 'Prototyping'],
      experience: '5년',
      location: '서울',
    },
    {
      id: '3',
      name: '박준호',
      position: '백엔드 개발자',
      avatar: 'https://images.unsplash.com/photo-1718179804654-7c3720b78e67?w=200&h=200&fit=crop',
      skills: ['Node.js', 'Python', 'AWS'],
      experience: '4년',
      location: '경기',
    },
    {
      id: '4',
      name: '최지우',
      position: '풀스택 개발자',
      avatar: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?w=200&h=200&fit=crop',
      skills: ['React', 'Node.js', 'MongoDB'],
      experience: '2년',
      location: '서울',
    },
    {
      id: '5',
      name: '정수진',
      position: '프로덕트 매니저',
      avatar: 'https://images.unsplash.com/photo-1762341120638-b5b9358ef571?w=200&h=200&fit=crop',
      skills: ['Agile', 'Jira', 'Product Strategy'],
      experience: '6년',
      location: '서울',
    },
  ],
}: CompanyProfilePageProps) {
  const stats: ProfileStat[] = [
    { label: '채용공고', value: company.jobPostings },
    { label: '팔로워', value: '1.2K' },
    { label: '북마크', value: bookmarkedApplicants.length },
  ];

  const handleEditProfile = () => {
    console.log('프로필 편집');
  };

  const handleShare = () => {
    console.log('프로필 공유');
  };

  const handleSettings = () => {
    console.log('설정');
  };

  return (
    <>
      <ProfileHeader
        onBackClick={() => console.log('뒤로가기')}
        onSettingsClick={handleSettings}
      />

      <div className="flex-1 overflow-y-auto">
        <ProfileInfo
          avatar={{
            src: company.avatar,
            fallback: company.name.slice(0, 2),
            alt: company.name,
          }}
          stats={stats}
          name={company.name}
          handle={company.username}
          bio={{
            description: company.description,
            location: company.location,
            email: company.email,
          }}
          actions={
            <ProfileActions
              primaryAction={{
                label: '프로필 편집',
                onClick: handleEditProfile,
              }}
              showMore={false}
              onShareClick={handleShare}
              onSettingsClick={handleSettings}
            />
          }
        />

        {/* 북마크한 지원자 섹션 */}
        <section className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-4">
            <Bookmark className="h-5 w-5 text-gray-900" />
            <h2 className="text-lg font-bold text-gray-900">북마크한 지원자</h2>
          </div>

          <div className="space-y-3">
            {bookmarkedApplicants.map(applicant => (
              <div
                key={applicant.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gray-200">
                    <Avatar className="h-full w-full rounded-full">
                      <AvatarImage src={applicant.avatar} alt={applicant.name} />
                      <AvatarFallback className="rounded-full">
                        {applicant.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{applicant.name}</h3>
                        <p className="text-sm text-gray-500">{applicant.position}</p>
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors shrink-0">
                        <Bookmark className="h-4 w-4 text-gray-800 fill-gray-800" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {applicant.skills.map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>경력 {applicant.experience}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {applicant.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button className="flex-1 bg-gray-50 border border-gray-200 rounded-lg py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                    프로필 보기
                  </button>
                  <button className="flex-1 bg-gray-50 border border-gray-200 rounded-lg py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                    메시지 보내기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
