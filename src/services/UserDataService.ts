/**
 * 일반 사용자(클라이언트)용 데이터 관리 서비스
 * 데이터베이스 기반으로 사용자 관련 데이터를 관리
 */

import { User, UserCredits } from '@/lib/db/models';
import { initializeDatabase } from '@/lib/db/init';

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  password: string;
  credits: number;
  role: 'client';
  phone?: string;
  location?: string;
  birthDate?: string;
  interests?: string[];
  bio?: string;
  totalConsultations?: number;
  averageRating?: number;
  joinDate?: string;
  lastActiveAt?: string;
  preferences?: {
    language: string;
    timezone: string;
    notifications: boolean;
  };
}

export class UserDataService {
  private static instance: UserDataService;
  private clientUsers: Map<string, ClientUser>;

  private constructor() {
    this.clientUsers = new Map();
    this.initializeClientUsers();
  }

  public static getInstance(): UserDataService {
    if (!UserDataService.instance) {
      UserDataService.instance = new UserDataService();
    }
    return UserDataService.instance;
  }

  /**
   * 데이터베이스 초기화
   */
  private async ensureDatabaseInitialized(): Promise<void> {
    await initializeDatabase();
  }

  /**
   * 클라이언트 사용자 초기화 (더미 데이터)
   */
  private initializeClientUsers(): void {
    // 기본 클라이언트 사용자들 (로그인 테스트용)
    const defaultClients: ClientUser[] = [
      {
        id: 'client_1',
        name: '김민수',
        email: 'minsu.kim@example.com',
        password: 'client123!',
        credits: 5000,
        role: 'client',
        phone: '010-1234-5678',
        location: '서울시 강남구',
        birthDate: '1990-05-15',
        interests: ['심리상담', '커리어상담'],
        bio: '새로운 도전을 좋아하는 개발자입니다.',
        totalConsultations: 3,
        averageRating: 4.8,
        joinDate: '2024-01-15',
        lastActiveAt: new Date().toISOString(),
        preferences: {
          language: 'ko',
          timezone: 'Asia/Seoul',
          notifications: true
        }
      },
      {
        id: 'client_2',
        name: '이지은',
        email: 'jieun.lee@example.com',
        password: 'client456!',
        credits: 3000,
        role: 'client',
        phone: '010-2345-6789',
        location: '서울시 서초구',
        birthDate: '1988-12-03',
        interests: ['법률상담', '재무상담'],
        bio: '법무팀에서 일하는 직장인입니다.',
        totalConsultations: 1,
        averageRating: 5.0,
        joinDate: '2024-02-20',
        lastActiveAt: new Date().toISOString(),
        preferences: {
          language: 'ko',
          timezone: 'Asia/Seoul',
          notifications: true
        }
      },
      {
        id: 'client_3',
        name: '박서준',
        email: 'seojun.park@example.com',
        password: 'client789!',
        credits: 8000,
        role: 'client',
        phone: '010-3456-7890',
        location: '서울시 마포구',
        birthDate: '1995-08-22',
        interests: ['비즈니스상담', '마케팅상담'],
        bio: '스타트업 창업을 준비하고 있습니다.',
        totalConsultations: 5,
        averageRating: 4.6,
        joinDate: '2024-01-10',
        lastActiveAt: new Date().toISOString(),
        preferences: {
          language: 'ko',
          timezone: 'Asia/Seoul',
          notifications: false
        }
      }
    ];

    defaultClients.forEach(client => {
      this.clientUsers.set(client.id, client);
    });
  }

  /**
   * 모든 클라이언트 사용자 조회
   */
  public getAllClientUsers(): ClientUser[] {
    return Array.from(this.clientUsers.values());
  }

  /**
   * ID로 클라이언트 사용자 조회
   */
  public getClientUserById(id: string): ClientUser | null {
    return this.clientUsers.get(id) || null;
  }

  /**
   * 이메일로 클라이언트 사용자 조회
   */
  public getClientUserByEmail(email: string): ClientUser | null {
    return Array.from(this.clientUsers.values()).find(user => user.email === email) || null;
  }

  /**
   * 클라이언트 사용자 생성
   */
  public createClientUser(userData: Omit<ClientUser, 'id'>): ClientUser {
    const id = `client_${Date.now()}`;
    const newUser: ClientUser = {
      ...userData,
      id,
      credits: userData.credits || 0,
      totalConsultations: userData.totalConsultations || 0,
      averageRating: userData.averageRating || 0,
      joinDate: userData.joinDate || new Date().toISOString(),
      lastActiveAt: userData.lastActiveAt || new Date().toISOString(),
      preferences: userData.preferences || {
        language: 'ko',
        timezone: 'Asia/Seoul',
        notifications: true
      }
    };

    this.clientUsers.set(id, newUser);
    return newUser;
  }

  /**
   * 클라이언트 사용자 업데이트
   */
  public updateClientUser(id: string, updates: Partial<ClientUser>): boolean {
    const currentUser = this.clientUsers.get(id);
    if (!currentUser) return false;

    const updatedUser = { ...currentUser, ...updates };
    this.clientUsers.set(id, updatedUser);
    return true;
  }

  /**
   * 클라이언트 사용자 삭제
   */
  public deleteClientUser(id: string): boolean {
    return this.clientUsers.delete(id);
  }

  /**
   * 로그인 검증
   */
  public validateClientLogin(email: string, password: string): ClientUser | null {
    const user = this.getClientUserByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  /**
   * 크레딧 업데이트
   */
  public updateClientCredits(id: string, newCredits: number): boolean {
    return this.updateClientUser(id, { credits: newCredits });
  }

  /**
   * 크레딧 추가
   */
  public addClientCredits(id: string, amount: number): boolean {
    const user = this.getClientUserById(id);
    if (!user) return false;

    return this.updateClientUser(id, { credits: user.credits + amount });
  }

  /**
   * 크레딧 차감
   */
  public deductClientCredits(id: string, amount: number): boolean {
    const user = this.getClientUserById(id);
    if (!user || user.credits < amount) return false;

    return this.updateClientUser(id, { credits: user.credits - amount });
  }

  /**
   * 상담 횟수 증가
   */
  public incrementConsultationCount(id: string): boolean {
    const user = this.getClientUserById(id);
    if (!user) return false;

    return this.updateClientUser(id, { 
      totalConsultations: (user.totalConsultations || 0) + 1 
    });
  }

  /**
   * 평점 업데이트
   */
  public updateAverageRating(id: string, newRating: number): boolean {
    return this.updateClientUser(id, { averageRating: newRating });
  }

  /**
   * 마지막 활동 시간 업데이트
   */
  public updateLastActiveAt(id: string): boolean {
    return this.updateClientUser(id, { 
      lastActiveAt: new Date().toISOString() 
    });
  }

  /**
   * DB에서 사용자 크레딧 정보 조회
   */
  public async getUserCreditsFromDB(userId: number): Promise<{
    total: number;
    used: number;
    remaining: number;
  } | null> {
    await this.ensureDatabaseInitialized();
    
    try {
      const userCredits = await UserCredits.findOne({
        where: { userId }
      });

      if (!userCredits) return null;

      return {
        total: userCredits.purchasedTotal + userCredits.aiChatTotal,
        used: userCredits.aiChatUsed,
        remaining: (userCredits.purchasedTotal + userCredits.aiChatTotal) - userCredits.aiChatUsed
      };
    } catch (error) {
      console.error('사용자 크레딧 조회 실패:', error);
      return null;
    }
  }

  /**
   * DB에서 사용자 정보 조회
   */
  public async getUserFromDB(userId: number): Promise<User | null> {
    await this.ensureDatabaseInitialized();
    
    try {
      return await User.findByPk(userId);
    } catch (error) {
      console.error('사용자 조회 실패:', error);
      return null;
    }
  }

  /**
   * 디버깅용 클라이언트 계정 정보 출력
   */
  public printClientCredentials(): void {
    const clients = this.getAllClientUsers();
    console.log('\n👥 클라이언트 로그인 계정 정보:');
    console.log('=' .repeat(80));
    
    clients.forEach((client, index) => {
      console.log(`\n${index + 1}. ${client.name} (${client.email})`);
      console.log(`   🔑 비밀번호: ${client.password}`);
      console.log(`   💰 크레딧: ${client.credits.toLocaleString()}원`);
      console.log(`   📊 상담 횟수: ${client.totalConsultations}회`);
      console.log(`   ⭐ 평점: ${client.averageRating}`);
      console.log(`   📍 위치: ${client.location}`);
      console.log(`   🆔 Client ID: ${client.id}`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('💡 사용법: 로그인 페이지에서 위 이메일/비밀번호로 로그인하세요!');
  }
}

// 싱글톤 인스턴스 생성
export const userDataService = UserDataService.getInstance();

// 개발 환경에서 브라우저 콘솔에 등록
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).userDataService = userDataService;
  (window as any).printClientCredentials = () => userDataService.printClientCredentials();
  
  // 페이지 로드 시 계정 정보 출력
  setTimeout(() => {
    userDataService.printClientCredentials();
  }, 1000);
}