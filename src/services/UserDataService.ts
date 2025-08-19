/**
 * 일반 사용자(클라이언트)용 데이터 관리 서비스
 * 전문가가 아닌 일반 사용자들의 더미 데이터 제공
 */

export interface ClientUser {
  id: string;
  name: string;
  email: string;
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
   * 더미 사용자 데이터 생성
   */
  private generateDummyUsers(): ClientUser[] {
    const names = [
      "이지은", "박민수", "김서연", "최다은", "정호영",
      "한소영", "윤재민", "임수빈", "강혜진", "조민호",
      "신예린", "오성민", "배유진", "문지훈", "노하늘"
    ];

    const interests = [
      ["심리상담", "진로상담"], 
      ["법률상담", "재무상담"], 
      ["건강상담", "교육상담"],
      ["심리상담", "사업상담"], 
      ["진로상담", "IT상담"],
      ["재무상담", "투자상담"], 
      ["심리상담", "법률상담"],
      ["교육상담", "진로상담"], 
      ["건강상담", "심리상담"],
      ["사업상담", "마케팅상담"]
    ];

    const locations = [
      "서울특별시 강남구", "서울특별시 서초구", "서울특별시 송파구",
      "경기도 성남시", "경기도 수원시", "인천광역시 연수구",
      "부산광역시 해운대구", "대구광역시 수성구", "광주광역시 서구",
      "대전광역시 유성구"
    ];

    const bios = [
      "다양한 분야의 전문가들과 상담을 통해 성장하고 있습니다.",
      "새로운 도전을 위해 전문가의 조언을 구하고 있습니다.",
      "개인적인 고민과 목표 달성을 위해 상담을 받고 있습니다.",
      "전문가들의 경험을 통해 더 나은 선택을 하고자 합니다.",
      "삶의 질 향상을 위해 지속적으로 상담을 받고 있습니다."
    ];

    return names.map((name, index) => ({
      id: `client_${index + 1}`,
      name,
      email: `${name.toLowerCase().replace(/\s/g, '')}@example.com`,
      credits: Math.floor(Math.random() * 500) + 100, // 100-600 크레딧
      role: 'client' as const,
      phone: `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      location: locations[index % locations.length],
      birthDate: `${1985 + (index % 15)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      interests: interests[index % interests.length],
      bio: bios[index % bios.length],
      totalConsultations: Math.floor(Math.random() * 20),
      favoriteExperts: Math.floor(Math.random() * 8),
      joinDate: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
    }));
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
   * 랜덤 사용자 생성 (일반 로그인용)
   */
  public createRandomUser(email: string): ClientUser {
    const randomNames = ["김민지", "이준호", "박서영", "최우진", "정하은"];
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    
    return {
      id: `client_${Date.now()}`,
      name: randomName,
      email: email,
      credits: 1000, // 신규 사용자 기본 크레딧
      role: 'client',
      phone: `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      location: "서울특별시",
      birthDate: "1990-01-01",
      interests: ["심리상담", "진로상담"],
      bio: "전문가들과의 상담을 통해 성장하고 있습니다.",
      totalConsultations: 0,
      favoriteExperts: 0,
      joinDate: new Date().toISOString().split('T')[0]
    };
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
    
    this.dummyUsers.slice(0, 5).forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.name}`);
      console.log(`   📧 이메일: ${user.email}`);
      console.log(`   💳 크레딧: ${user.credits}`);
      console.log(`   📍 위치: ${user.location}`);
      console.log(`   🎯 관심사: ${user.interests?.join(', ')}`);
      console.log(`   📊 상담 횟수: ${user.totalConsultations}`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('💡 일반 로그인: 아무 이메일 + 4자리 이상 비밀번호로 자동 생성됩니다!');
  }
}

// 싱글톤 인스턴스 생성
export const userDataService = UserDataService.getInstance();

// 개발 환경에서 브라우저 콘솔에 등록
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).userDataService = userDataService;
  (window as any).printDummyUsers = () => userDataService.printDummyUsers();
}
