export interface Company {
  id: string;
  name: string;
  username: string;
  description?: string;
  location?: string;
  email?: string;
  website?: string;
  avatar: string;
  jobPostings: number;
  followers: number;
  bookmarks: number;
}

export interface Applicant {
  id: string;
  name: string;
  position: string;
  avatar: string;
  skills: string[];
  experience: string;
  location: string;
  isBookmarked?: boolean;
  bookmarkedAt?: string;
}

export interface BookmarkedApplicantsResponse {
  success: boolean;
  data: Applicant[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    hasNext: boolean;
  };
}

export interface BookmarkToggleResponse {
  success: boolean;
  data: {
    applicantId: string;
    isBookmarked: boolean;
    message: string;
  };
}

export interface CompanyProfile {
  company: Company;
  bookmarkedApplicants: Applicant[];
}