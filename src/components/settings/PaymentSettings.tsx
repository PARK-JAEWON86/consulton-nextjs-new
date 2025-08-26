"use client";

import { useState, useEffect } from 'react';
import { CreditCard, Wallet, History, Plus, Trash2, Edit, ChevronUp, ChevronDown } from 'lucide-react';
import { 
  PaymentMethod, 
  PaymentHistory, 
  getUserPaymentMethods, 
  getUserPaymentHistory,
  getUserCreditTransactions 
} from '@/data/dummy/payment';

export default function PaymentSettings() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [creditTransactions, setCreditTransactions] = useState<any[]>([]);
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [showTopupHistory, setShowTopupHistory] = useState(false);
  const [showUsageHistory, setShowUsageHistory] = useState(false);

  // 더미 데이터 로드
  useEffect(() => {
    // 실제로는 API에서 데이터를 가져와야 합니다
    // 현재는 더미 데이터를 사용
    const userId = 'user_001'; // 실제로는 인증된 사용자 ID를 사용해야 함
    
    setPaymentMethods(getUserPaymentMethods(userId));
    setPaymentHistory(getUserPaymentHistory(userId));
    setCreditTransactions(getUserCreditTransactions(userId));
  }, []);

  const handleAddMethod = () => {
    setShowAddMethod(true);
  };

  const handleEditMethod = (method: PaymentMethod) => {
    setEditingMethod(method);
  };

  const handleDeleteMethod = (id: string) => {
    if (confirm('정말로 이 결제 수단을 삭제하시겠습니까?')) {
      setPaymentMethods(methods => methods.filter(m => m.id !== id));
    }
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(m => ({
        ...m,
        isDefault: m.id === id
      }))
    );
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'topup':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'consultation':
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      case 'refund':
        return <Wallet className="h-4 w-4 text-orange-600" />;
      case 'withdrawal':
        return <History className="h-4 w-4 text-purple-600" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
          결제 정보
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          결제 수단과 결제 내역을 관리하세요.
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* 결제 수단 섹션 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900">결제 수단</h4>
            <button
              onClick={handleAddMethod}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              추가
            </button>
          </div>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {method.type === 'card' ? (
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Wallet className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {method.name}
                      {method.isDefault && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          기본
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {method.type === 'card' 
                        ? `**** **** **** ${method.last4} • ${method.expiryDate}`
                        : method.bankName
                      }
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      기본으로 설정
                    </button>
                  )}
                  <button
                    onClick={() => handleEditMethod(method)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  {!method.isDefault && (
                    <button
                      onClick={() => handleDeleteMethod(method.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

                {/* 크레딧 내역 섹션 (좌우 배치) */}
        <div>
          <div className="mb-4">
            <h4 className="text-lg font-medium text-gray-900">크레딧 내역</h4>
            <p className="text-sm text-gray-600">크레딧 충전 및 사용 내역을 확인할 수 있습니다.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 좌측: 크레딧 충전 내역 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-md font-medium text-gray-900 flex items-center">
                  <Plus className="h-4 w-4 mr-2 text-green-600" />
                  크레딧 충전 내역
                </h5>
                <button 
                  onClick={() => setShowTopupHistory(!showTopupHistory)}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  {showTopupHistory ? '접기' : '펼치기'}
                  {showTopupHistory ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>
              </div>

              {showTopupHistory ? (
                <div className="space-y-3">
                  {paymentHistory
                    .filter(item => item.type === 'topup')
                    .slice(0, 5)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">
                            {item.description}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(item.date).toLocaleDateString('ko-KR')}
                          </div>
                          {item.credits && (
                            <div className="text-xs text-blue-600 font-medium">
                              +{item.credits} 크레딧
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status === 'completed' && '완료'}
                            {item.status === 'pending' && '대기중'}
                            {item.status === 'failed' && '실패'}
                          </span>
                          <span className="font-medium text-green-600 text-sm">
                            +{formatAmount(item.amount)}
                          </span>
                        </div>
                      </div>
                    ))}
                  
                  {paymentHistory.filter(item => item.type === 'topup').length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <Plus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">아직 크레딧 충전 내역이 없습니다.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Plus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">크레딧 충전 내역을 확인하려면 펼쳐보세요</p>
                </div>
              )}
            </div>

            {/* 우측: 크레딧 사용 내역 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-md font-medium text-gray-900 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-red-600" />
                  크레딧 사용 내역
                </h5>
                <button 
                  onClick={() => setShowUsageHistory(!showUsageHistory)}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  {showUsageHistory ? '접기' : '펼치기'}
                  {showUsageHistory ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>
              </div>

              {showUsageHistory ? (
                <div className="space-y-3">
                  {creditTransactions
                    .filter(transaction => transaction.type === 'spend')
                    .slice(0, 5)
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">
                            {transaction.description}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString('ko-KR')}
                          </div>
                          {transaction.consultationId && (
                            <div className="text-xs text-blue-600">
                              상담 ID: {transaction.consultationId}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-3">
                          <span className="px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-100">
                            사용
                          </span>
                          <div className="text-right">
                            <div className="font-medium text-red-600 text-sm">
                              -{Math.abs(transaction.amount)} 크레딧
                            </div>
                            <div className="text-xs text-gray-500">
                              잔액: {transaction.balance}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {creditTransactions.filter(transaction => transaction.type === 'spend').length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">아직 크레딧 사용 내역이 없습니다.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">크레딧 사용 내역을 확인하려면 펼쳐보세요</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 결제 수단 추가/편집 모달 (간단한 형태) */}
        {showAddMethod && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                결제 수단 추가
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    결제 수단 유형
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="card">신용카드</option>
                    <option value="bank">계좌이체</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAddMethod(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => setShowAddMethod(false)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    추가
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
