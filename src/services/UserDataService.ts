/**
 * 일반 사용자(클라이언트)용 데이터 관리 서비스
 * 전문가가 아닌 일반 사용자들의 더미 데이터 제공
 */

import { dummyUserProfile } from '@/data/dummy/users';

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  password: string; // 비밀번호 필드 추가
  credits: number;
  role: 'client';
  phone?: string;
  location?: string;
  birthDate?: string;
  interests?: string[];
  bio?: string;
  totalConsultations?: number;
  favoriteExperts?: number;
  joinDate?: string;
}

export class UserDataService {
  private static instance: UserDataService;
  private dummyUsers: ClientUser[];

  private constructor() {
    this.dummyUsers = this.generateDummyUsers();
  }

  public static getInstance(): UserDataService {
    if (!UserDataService.instance) {
      UserDataService.instance = new UserDataService();
    }
    return UserDataService.instance;
  }

    /**
   * 더미 사용자 데이터 생성 (더미데이터 활용)
   */
  private generateDummyUsers(): ClientUser[] {
    const users = [
      {
        id: "client_1",
        name: dummyUserProfile.name,
        email: dummyUserProfile.email, // 김철수의 실제 이메일 사용
        password: "password123", // 고정된 비밀번호
        credits: dummyUserProfile.credits,
        role: 'client' as const,
        phone: dummyUserProfile.phone,
        location: dummyUserProfile.location,
        birthDate: dummyUserProfile.birthDate,
        interests: dummyUserProfile.interests,
        bio: dummyUserProfile.bio,
        totalConsultations: dummyUserProfile.totalConsultations,
        favoriteExperts: dummyUserProfile.favoriteExperts,
        joinDate: dummyUserProfile.joinDate
      }
    ];
    
    return users;
  }

  /**
   * 모든 더미 사용자 조회
   */
  public getAllUsers(): ClientUser[] {
    return [...this.dummyUsers];
  }

  /**
   * ID로 사용자 조회
   */
  public getUserById(id: string): ClientUser | null {
    return this.dummyUsers.find(user => user.id === id) || null;
  }

  /**
   * 이메일로 사용자 조회
   */
  public getUserByEmail(email: string): ClientUser | null {
    return this.dummyUsers.find(user => user.email === email) || null;
  }

  /**
   * 이메일과 비밀번호로 사용자 인증
   */
  public authenticateUser(email: string, password: string): ClientUser | null {
    const user = this.dummyUsers.find(user => 
      user.email === email && user.password === password
    );
    return user || null;
  }

  /**
   * 랜덤 사용자 생성 (일반 로그인용) - 제거됨
   */
  public createRandomUser(email: string): ClientUser | null {
    // 더 이상 랜덤 사용자를 생성하지 않음
    return null;
  }

  /**
   * 사용자 데이터 업데이트
   */
  public updateUser(id: string, updates: Partial<ClientUser>): boolean {
    const userIndex = this.dummyUsers.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.dummyUsers[userIndex] = { ...this.dummyUsers[userIndex], ...updates };
    return true;
  }

  /**
   * 로그인 계정 정보 출력 (개발용)
   */
  public printDummyUsers(): void {
    console.log('\n👥 일반 사용자 더미 데이터:');
    console.log('=' .repeat(80));
    
    this.dummyUsers.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name}`);
      console.log(`   📧 이메일: ${user.email}`);
      console.log(`   🔑 비밀번호: ${user.password}`);
      console.log(`   💳 크레딧: ${user.credits}`);
      console.log(`   📍 위치: ${user.location}`);
      console.log(`   🎯 관심사: ${user.interests?.join(', ')}`);
      console.log(`   📊 상담 횟수: ${user.totalConsultations}`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('💡 일반 로그인: 위의 이메일과 비밀번호를 사용하세요!');
  }
}

// 싱글톤 인스턴스 생성
export const userDataService = UserDataService.getInstance();

// 개발 환경에서 브라우저 콘솔에 등록
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).userDataService = userDataService;
}
