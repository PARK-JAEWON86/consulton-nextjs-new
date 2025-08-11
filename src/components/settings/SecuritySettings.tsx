"use client";

import { useState } from 'react';
import { Shield, Smartphone, Key, Eye, Clock, MapPin, AlertTriangle, Check, X } from 'lucide-react';
import NotificationToggle from './NotificationToggle';

interface LoginHistory {
  id: number;
  device: string;
  location: string;
  ip: string;
  time: string;
  status: 'success' | 'failed';
  current: boolean;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const SecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30'); // minutes
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const [loginHistory] = useState<LoginHistory[]>([
    {
      id: 1,
      device: 'Chrome on Windows',
      location: '서울, 대한민국',
      ip: '192.168.1.100',
      time: '2024-01-15 14:30',
      status: 'success',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: '서울, 대한민국',
      ip: '192.168.1.101',
      time: '2024-01-15 09:15',
      status: 'success',
      current: false
    },
    {
      id: 3,
      device: 'Chrome on Android',
      location: '부산, 대한민국',
      ip: '203.255.100.50',
      time: '2024-01-14 16:45',
      status: 'failed',
      current: false
    }
  ]);

  const recoveryCodes = [
    'A1B2-C3D4-E5F6',
    'G7H8-I9J0-K1L2',
    'M3N4-O5P6-Q7R8',
    'S9T0-U1V2-W3X4',
    'Y5Z6-A7B8-C9D0'
  ];

  const handleEnable2FA = async () => {
    setSaveStatus('saving');
    
    try {
      // 2FA 설정 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTwoFactorEnabled(true);
      setSaveStatus('saved');
      
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm('2단계 인증을 비활성화하시겠습니까? 계정 보안이 약해질 수 있습니다.')) {
      return;
    }

    setSaveStatus('saving');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTwoFactorEnabled(false);
      setSaveStatus('saved');
      
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  const handleRevokeSession = async (sessionId: number) => {
    if (!confirm('이 세션을 종료하시겠습니까?')) {
      return;
    }

    try {
      // 세션 종료 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('세션이 성공적으로 종료되었습니다.');
    } catch (error) {
      alert('세션 종료에 실패했습니다.');
    }
  };

  const handleSaveSecuritySettings = async () => {
    setSaveStatus('saving');
    
    try {
      // 보안 설정 저장 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveStatus('saved');
      
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  const getStatusColor = (status: 'success' | 'failed') => {
    return status === 'success' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusText = (status: 'success' | 'failed') => {
    return status === 'success' ? '성공' : '실패';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">보안 설정</h2>
        <p className="text-gray-600 mb-6">계정 보안을 강화하고 로그인 활동을 모니터링하세요.</p>
      </div>

      {/* 2단계 인증 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">2단계 인증</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div>
              <div className="font-medium text-gray-900">2단계 인증</div>
              <div className="text-sm text-gray-600">
                로그인 시 추가 보안 코드를 요구합니다
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`text-sm font-medium ${twoFactorEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                {twoFactorEnabled ? '활성화됨' : '비활성화됨'}
              </span>
              {twoFactorEnabled ? (
                <button
                  onClick={handleDisable2FA}
                  disabled={saveStatus === 'saving'}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  비활성화
                </button>
              ) : (
                <button
                  onClick={handleEnable2FA}
                  disabled={saveStatus === 'saving'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  활성화
                </button>
              )}
            </div>
          </div>

          {twoFactorEnabled && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 mb-2">복구 코드</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    인증 앱에 접근할 수 없을 때 사용할 수 있는 복구 코드입니다.
                  </p>
                  <button
                    onClick={() => setShowRecoveryCodes(!showRecoveryCodes)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showRecoveryCodes ? '숨기기' : '복구 코드 보기'}
                  </button>
                </div>
              </div>
              
              {showRecoveryCodes && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                  <div className="grid grid-cols-2 gap-2">
                    {recoveryCodes.map((code, index) => (
                      <div key={index} className="font-mono text-sm bg-gray-100 p-2 rounded text-center">
                        {code}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    이 코드들을 안전한 곳에 보관하세요. 각 코드는 한 번만 사용할 수 있습니다.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 로그인 알림 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">로그인 알림</h3>
        </div>
        
        <NotificationToggle
          label="새로운 로그인 알림"
          description="알 수 없는 기기나 위치에서 로그인할 때 알림을 받습니다"
          checked={loginAlerts}
          onChange={setLoginAlerts}
        />
      </div>

      {/* 세션 관리 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">세션 관리</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              세션 타임아웃
            </label>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="15">15분</option>
              <option value="30">30분</option>
              <option value="60">1시간</option>
              <option value="120">2시간</option>
              <option value="0">무제한</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              활동이 없을 때 자동으로 로그아웃되는 시간을 설정합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 로그인 기록 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Key className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">로그인 기록</h3>
        </div>
        
        <div className="space-y-3">
          {loginHistory.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{session.location}</span>
                </div>
                <div className="text-sm text-gray-600">{session.ip}</div>
                <div className="text-sm text-gray-600">{session.time}</div>
                <span className={`text-sm font-medium ${getStatusColor(session.status)}`}>
                  {getStatusText(session.status)}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">{session.device}</span>
                {session.current && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    현재 세션
                  </span>
                )}
                {!session.current && (
                  <button
                    onClick={() => handleRevokeSession(session.id)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    세션 종료
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSecuritySettings}
          disabled={saveStatus === 'saving'}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {saveStatus === 'saving' ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>저장 중...</span>
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              <span>보안 설정 저장</span>
            </>
          )}
        </button>
      </div>

      {/* 상태 메시지 */}
      {saveStatus === 'saved' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 text-green-800">
            <Check className="h-5 w-5" />
            <span>보안 설정이 성공적으로 저장되었습니다.</span>
          </div>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-800">
            <X className="h-5 w-5" />
            <span>보안 설정 저장에 실패했습니다. 다시 시도해주세요.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySettings;
