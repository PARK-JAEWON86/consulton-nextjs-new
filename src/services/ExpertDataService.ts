/**
 * 중앙 집중식 전문가 데이터 관리 서비스
 * 모든 전문가 관련 데이터를 한 곳에서 관리하여 동기화 문제 해결
 */

import { dummyExperts, convertExpertItemToProfile, type ExpertItem } from '@/data/dummy/experts';
import { ExpertProfile } from '@/types';

export class ExpertDataService {
  private static instance: ExpertDataService;
  private experts: ExpertItem[];
  private expertProfiles: Map<number, ExpertProfile>;

  private constructor() {
    this.experts = [...dummyExperts];
    this.expertProfiles = new Map();
    this.initializeProfiles();
  }

  public static getInstance(): ExpertDataService {
    if (!ExpertDataService.instance) {
      ExpertDataService.instance = new ExpertDataService();
    }
    return ExpertDataService.instance;
  }

  /**
   * 전문가 프로필 초기화
   */
  private initializeProfiles(): void {
    this.experts.forEach(expert => {
      const profile = convertExpertItemToProfile(expert);
      this.expertProfiles.set(expert.id, profile);
    });
  }

  /**
   * 모든 전문가 데이터 조회
   */
  public getAllExperts(): ExpertItem[] {
    return [...this.experts];
  }

  /**
   * ID로 전문가 데이터 조회
   */
  public getExpertById(id: number): ExpertItem | null {
    return this.experts.find(expert => expert.id === id) || null;
  }

  /**
   * ID로 전문가 프로필 조회 (ExpertProfile 타입)
   */
  public getExpertProfileById(id: number): ExpertProfile | null {
    return this.expertProfiles.get(id) || null;
  }

  /**
   * 전문가 프로필 업데이트
   */
  public updateExpertProfile(id: number, updates: Partial<ExpertProfile>): boolean {
    const currentProfile = this.expertProfiles.get(id);
    if (!currentProfile) return false;

    const updatedProfile = { ...currentProfile, ...updates };
    this.expertProfiles.set(id, updatedProfile);

    // 기본 ExpertItem도 동기화
    const expertIndex = this.experts.findIndex(expert => expert.id === id);
    if (expertIndex !== -1) {
      this.experts[expertIndex] = {
        ...this.experts[expertIndex],
        name: updatedProfile.name,
        specialty: updatedProfile.specialty,
        experience: updatedProfile.experience,
        description: updatedProfile.description,
        totalSessions: updatedProfile.totalSessions,
        avgRating: updatedProfile.avgRating,
        rating: updatedProfile.rating,
        reviewCount: updatedProfile.reviewCount,
        completionRate: updatedProfile.completionRate,
        pricePerMinute: updatedProfile.pricePerMinute,
        consultationTypes: updatedProfile.consultationTypes.map(type => type as string),
        languages: updatedProfile.languages,
        certifications: updatedProfile.certifications,
        education: updatedProfile.education,
        location: updatedProfile.location,
        responseTime: updatedProfile.responseTime,
      };
    }

    return true;
  }

  /**
   * 로그인용 전문가 계정 생성
   */
  public getLoginAccounts(): Array<{
    id: number;
    email: string;
    password: string;
    name: string;
    specialty: string;
    level: string;
    description: string;
  }> {
    const passwords = [
      "expert123!", "lawyer456!", "finance789!", "career2024!", "business555!",
      "health888!", "tech999!", "education777!", "design888!", "invest999!"
    ];

    const emailMap: { [key: string]: string } = {
      "박지영": "jiyoung.park",
      "이민수": "minsu.lee", 
      "이소연": "soyeon.lee",
      "김진우": "jinwoo.kim",
      "정수민": "sumin.jung",
      "박건호": "gunho.park",
      "김민정": "minjung.kim",
      "이상훈": "sanghun.lee",
      "정현아": "hyuna.jung",
      "최서연": "seoyeon.choi"
    };

    return this.experts.slice(0, 10).map((expert, index) => {
      const level = this.calculateLevel(expert.totalSessions);
      const levelStr = level >= 700 ? `고급 (레벨 ${level})` :
                       level >= 500 ? `고급 (레벨 ${level})` :
                       level >= 300 ? `중급 (레벨 ${level})` :
                       level >= 200 ? `중급 (레벨 ${level})` :
                       `초급 (레벨 ${level})`;

      return {
        id: expert.id,
        email: `${emailMap[expert.name] || `expert${expert.id}`}@consulton.co.kr`,
        password: passwords[index] || "expert123!",
        name: expert.name,
        specialty: expert.specialty,
        level: levelStr,
        description: `${expert.description.substring(0, 40)}..., ${expert.experience}년 경력, ${expert.pricePerMinute}원/분`
      };
    });
  }

  /**
   * 로그인 검증
   */
  public validateLogin(email: string, password: string): { id: number; email: string; name: string; specialty: string } | null {
    const accounts = this.getLoginAccounts();
    const account = accounts.find(acc => acc.email === email && acc.password === password);
    return account ? {
      id: account.id,
      email: account.email,
      name: account.name,
      specialty: account.specialty
    } : null;
  }

  /**
   * 레벨 계산
   */
  private calculateLevel(sessions: number): number {
    if (sessions >= 700) return Math.min(999, 700 + Math.floor((sessions - 700) / 10));
    if (sessions >= 500) return 600 + Math.floor((sessions - 500) / 5);
    if (sessions >= 300) return 400 + Math.floor((sessions - 300) / 2);
    if (sessions >= 200) return 300 + Math.floor((sessions - 200) / 2);
    if (sessions >= 100) return 200 + Math.floor((sessions - 100) / 1);
    return Math.max(1, 100 + Math.floor(sessions / 2));
  }

  /**
   * 전문가의 완전한 사용자 정보 생성 (로그인용)
   */
  public createUserFromExpert(expertId: number): any {
    const expert = this.getExpertById(expertId);
    const profile = this.getExpertProfileById(expertId);
    
    if (!expert || !profile) return null;

    return {
      id: `expert_${expertId}`,
      email: this.getLoginAccounts().find(acc => acc.id === expertId)?.email || `expert${expertId}@consulton.co.kr`,
      name: expert.name,
      credits: 0,
      expertLevel: profile.level,
      role: 'expert' as const,
      expertProfile: profile
    };
  }

  /**
   * 디버깅용 로그인 계정 정보 출력
   */
  public printLoginCredentials(): void {
    const accounts = this.getLoginAccounts();
    console.log('\n🔐 전문가 로그인 계정 정보 (중앙 관리):');
    console.log('=' .repeat(80));
    
    accounts.forEach((account, index) => {
      console.log(`\n${index + 1}. ${account.name} (${account.specialty})`);
      console.log(`   📧 이메일: ${account.email}`);
      console.log(`   🔑 비밀번호: ${account.password}`);
      console.log(`   📊 레벨: ${account.level}`);
      console.log(`   📝 설명: ${account.description}`);
      console.log(`   🆔 Expert ID: ${account.id}`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('💡 사용법: 로그인 페이지에서 위 이메일/비밀번호로 로그인하세요!');
    console.log('🔗 이제 모든 데이터가 중앙에서 완벽하게 동기화됩니다!');
  }
}

// 싱글톤 인스턴스 생성
export const expertDataService = ExpertDataService.getInstance();

// 개발 환경에서 브라우저 콘솔에 등록
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).expertDataService = expertDataService;
  (window as any).printExpertCredentials = () => expertDataService.printLoginCredentials();
  
  // 페이지 로드 시 계정 정보 출력
  setTimeout(() => {
    expertDataService.printLoginCredentials();
  }, 1000);
}
