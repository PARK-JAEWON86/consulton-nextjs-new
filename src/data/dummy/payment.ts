// 결제 정보 더미 데이터
// TODO: 실제 API 연동 시 이 파일을 삭제하세요

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'bank';
  name: string;
  last4?: string;
  bankName?: string;
  isDefault: boolean;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentHistory {
  id: string;
  userId: string;
  date: string;
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'topup' | 'consultation' | 'refund' | 'withdrawal';
  paymentMethodId?: string;
  consultationId?: string;
  credits?: number;
  createdAt: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: 'earn' | 'spend' | 'refund' | 'expire';
  amount: number;
  balance: number;
  description: string;
  consultationId?: string;
  createdAt: string;
}

// 결제 수단 더미 데이터
export const dummyPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_001',
    userId: 'client_1',
    type: 'card',
    name: '신한카드',
    last4: '1234',
    isDefault: true,
    expiryDate: '12/25',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'pm_002',
    userId: 'client_1',
    type: 'bank',
    name: '신한은행',
    bankName: '신한은행',
    isDefault: false,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'pm_003',
    userId: 'client_1',
    type: 'card',
    name: 'KB국민카드',
    last4: '5678',
    isDefault: false,
    expiryDate: '06/26',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  }
];

// 결제 내역 더미 데이터
export const dummyPaymentHistory: PaymentHistory[] = [
  {
    id: 'ph_001',
    userId: 'client_1',
    date: '2024-01-05',
    amount: 80000,
    description: '스탠다드 충전 패키지 (8,000 + 1,200 보너스 크레딧)',
    status: 'completed',
    type: 'topup',
    paymentMethodId: 'pm_001',
    credits: 9200,
    createdAt: '2024-01-05T09:15:00Z'
  },
  {
    id: 'ph_002',
    userId: 'client_1',
    date: '2024-01-10',
    amount: -15000,
    description: '전문가 상담 - 김민수 (진로상담)',
    status: 'completed',
    type: 'consultation',
    paymentMethodId: 'pm_001',
    consultationId: 'cons_001',
    credits: -150,
    createdAt: '2024-01-10T14:20:00Z'
  },
  {
    id: 'ph_003',
    userId: 'client_1',
    date: '2024-01-08',
    amount: -12000,
    description: '전문가 상담 - 박지영 (심리상담)',
    status: 'completed',
    type: 'consultation',
    paymentMethodId: 'pm_001',
    consultationId: 'cons_002',
    credits: -120,
    createdAt: '2024-01-08T16:45:00Z'
  },
  {
    id: 'ph_004',
    userId: 'client_1',
    date: '2024-01-03',
    amount: -8000,
    description: '전문가 상담 - 이수진 (재무상담)',
    status: 'completed',
    type: 'consultation',
    paymentMethodId: 'pm_001',
    consultationId: 'cons_003',
    credits: -80,
    createdAt: '2024-01-03T11:30:00Z'
  }
];

// 크레딧 거래 내역 더미 데이터
export const dummyCreditTransactions: CreditTransaction[] = [
  {
    id: 'ct_001',
    userId: 'client_1',
    type: 'earn',
    amount: 9200,
    balance: 9200,
    description: '스탠다드 충전 패키지 (8,000 + 1,200 보너스 크레딧)',
    createdAt: '2024-01-05T09:15:00Z'
  },
  {
    id: 'ct_002',
    userId: 'client_1',
    type: 'spend',
    amount: -150,
    balance: 9050,
    description: '전문가 상담 - 김민수 (진로상담)',
    consultationId: 'cons_001',
    createdAt: '2024-01-10T14:20:00Z'
  },
  {
    id: 'ct_003',
    userId: 'client_1',
    type: 'spend',
    amount: -120,
    balance: 8930,
    description: '전문가 상담 - 박지영 (심리상담)',
    consultationId: 'cons_002',
    createdAt: '2024-01-08T16:45:00Z'
  },
  {
    id: 'ct_004',
    userId: 'client_1',
    type: 'spend',
    amount: -80,
    balance: 8850,
    description: '전문가 상담 - 이수진 (재무상담)',
    consultationId: 'cons_003',
    createdAt: '2024-01-03T11:30:00Z'
  }
];

// 사용자별 결제 정보 조회 함수
export const getUserPaymentMethods = (userId: string): PaymentMethod[] => {
  return dummyPaymentMethods.filter(method => method.userId === userId);
};

export const getUserPaymentHistory = (userId: string): PaymentHistory[] => {
  return dummyPaymentHistory
    .filter(history => history.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getUserCreditTransactions = (userId: string): CreditTransaction[] => {
  return dummyCreditTransactions
    .filter(transaction => transaction.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getDefaultPaymentMethod = (userId: string): PaymentMethod | undefined => {
  return dummyPaymentMethods.find(method => method.userId === userId && method.isDefault);
};
