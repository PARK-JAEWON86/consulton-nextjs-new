/**
 * 플랫폼 통계 관리를 위한 유틸리티
 * 실제 비즈니스 로직에서 통계를 업데이트할 때 사용
 */

import { statsUtils } from "@/stores/statsStore";

export class StatsManager {
  /**
   * 사용자 등록 시 호출
   */
  static async handleUserRegistration(userId: string): Promise<void> {
    try {
      // 통계 업데이트
      statsUtils.onUserRegistered();
      
      // TODO: 실제 API 호출
      // await fetch('/api/stats/user-registered', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId, timestamp: new Date() })
      // });
      
      console.log(`사용자 등록 통계 업데이트: ${userId}`);
    } catch (error) {
      console.error('사용자 등록 통계 업데이트 실패:', error);
    }
  }

  /**
   * 전문가 등록 시 호출
   */
  static async handleExpertRegistration(expertId: string): Promise<void> {
    try {
      // 통계 업데이트
      statsUtils.onExpertRegistered();
      
      // TODO: 실제 API 호출
      // await fetch('/api/stats/expert-registered', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ expertId, timestamp: new Date() })
      // });
      
      console.log(`전문가 등록 통계 업데이트: ${expertId}`);
    } catch (error) {
      console.error('전문가 등록 통계 업데이트 실패:', error);
    }
  }

  /**
   * 상담 완료 시 호출
   */
  static async handleConsultationCompleted(consultationId: string): Promise<void> {
    try {
      // 통계 업데이트
      statsUtils.onConsultationCompleted();
      
      // TODO: 실제 API 호출
      // await fetch('/api/stats/consultation-completed', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ consultationId, timestamp: new Date() })
      // });
      
      console.log(`상담 완료 통계 업데이트: ${consultationId}`);
    } catch (error) {
      console.error('상담 완료 통계 업데이트 실패:', error);
    }
  }

  /**
   * 매칭 완료 시 호출 (매칭 시간 기록)
   */
  static async handleMatchingCompleted(
    userId: string, 
    expertId: string, 
    matchingTimeMinutes: number
  ): Promise<void> {
    try {
      // 통계 업데이트
      statsUtils.onMatchingCompleted(userId, expertId, matchingTimeMinutes);
      
      // TODO: 실제 API 호출
      // await fetch('/api/stats/matching-completed', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     userId, 
      //     expertId, 
      //     matchingTimeMinutes, 
      //     timestamp: new Date() 
      //   })
      // });
      
      console.log(`매칭 완료 통계 업데이트: ${userId} -> ${expertId} (${matchingTimeMinutes}분)`);
    } catch (error) {
      console.error('매칭 완료 통계 업데이트 실패:', error);
    }
  }

  /**
   * 매칭 시작 시간 기록
   */
  static recordMatchingStart(userId: string): void {
    const startTime = Date.now();
    
    // 세션 스토리지에 매칭 시작 시간 저장
    sessionStorage.setItem(`matching_start_${userId}`, startTime.toString());
    
    console.log(`매칭 시작 기록: ${userId} at ${new Date(startTime)}`);
  }

  /**
   * 매칭 완료 및 시간 계산
   */
  static async completeMatching(userId: string, expertId: string): Promise<void> {
    try {
      const startTimeStr = sessionStorage.getItem(`matching_start_${userId}`);
      
      if (!startTimeStr) {
        console.warn('매칭 시작 시간을 찾을 수 없습니다.');
        return;
      }

      const startTime = parseInt(startTimeStr);
      const endTime = Date.now();
      const matchingTimeMinutes = Math.max(1, Math.round((endTime - startTime) / 60000)); // 최소 1분

      // 매칭 완료 처리
      await this.handleMatchingCompleted(userId, expertId, matchingTimeMinutes);
      
      // 세션 스토리지에서 시작 시간 제거
      sessionStorage.removeItem(`matching_start_${userId}`);
      
    } catch (error) {
      console.error('매칭 완료 처리 실패:', error);
    }
  }

  /**
   * 현재 통계 조회
   */
  static getCurrentStats() {
    return statsUtils.getCurrentStats();
  }

  /**
   * 통계 리셋 (관리자 전용)
   */
  static async resetAllStats(): Promise<void> {
    try {
      // TODO: 관리자 권한 확인
      
      // 스토어 리셋
      const { useStatsStore } = await import('@/stores/statsStore');
      useStatsStore.getState().resetStats();
      
      // TODO: API 호출로 서버 데이터도 리셋
      // await fetch('/api/admin/reset-stats', { method: 'POST' });
      
      console.log('모든 통계가 리셋되었습니다.');
    } catch (error) {
      console.error('통계 리셋 실패:', error);
    }
  }
}

/**
 * 실제 사용 예시:
 * 
 * // 사용자 등록 시
 * await StatsManager.handleUserRegistration(newUser.id);
 * 
 * // 전문가 등록 시
 * await StatsManager.handleExpertRegistration(newExpert.id);
 * 
 * // 매칭 시작 시
 * StatsManager.recordMatchingStart(userId);
 * 
 * // 매칭 완료 시
 * await StatsManager.completeMatching(userId, expertId);
 * 
 * // 상담 완료 시
 * await StatsManager.handleConsultationCompleted(consultationId);
 */

export default StatsManager;
