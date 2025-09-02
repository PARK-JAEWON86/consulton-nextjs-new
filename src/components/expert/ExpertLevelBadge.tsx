"use client";

import { useState, useEffect } from 'react';
<<<<<<< HEAD
=======
import { TrendingUp } from 'lucide-react';
>>>>>>> 6615aeb (expert profile update)

interface ExpertLevelBadgeProps {
  expertId: string;
  size?: 'sm' | 'md' | 'lg' | 'like';
  className?: string;
}

interface LevelData {
  currentLevel: number;
  levelTitle: string;
  levelProgress: {
    current: number;
    next: number;
    percentage: number;
  };
  tierInfo?: {
    name: string;
    bgColor: string;
    color: string;
    textColor: string;
    borderColor: string;
  };
}

export default function ExpertLevelBadge({
  expertId,
  size = 'md',
  className = ''
}: ExpertLevelBadgeProps) {
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExpertLevel = async () => {
      try {
        setIsLoading(true);
        const startTime = performance.now();
        
        // 새로운 API를 통해 전문가 레벨 정보를 가져옴
        const response = await fetch(`/api/expert-levels?action=getExpertLevel&expertId=${expertId}`);
        const result = await response.json();
        
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        console.log(`전문가 레벨 API 호출 시간: ${loadTime.toFixed(2)}ms (expertId: ${expertId})`);
        
        if (result.currentLevel && result.levelTitle) {
          setLevelData(result);
        } else {
          // API에서 데이터를 가져올 수 없는 경우 null로 설정하여 스켈레톤 유지
          setLevelData(null);
        }
      } catch (error) {
        console.error('전문가 레벨 로드 실패:', error);
        // 에러 발생 시 null로 설정하여 스켈레톤 유지
        setLevelData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (expertId) {
      loadExpertLevel();
    }
  }, [expertId]);

  // 로딩 중이거나 데이터가 없을 때 스켈레톤 표시
  if (isLoading || !levelData) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded-full ${getSizeClasses(size)} ${className}`} />
    );
  }

  const { currentLevel, levelTitle, levelProgress, tierInfo } = levelData;
  // API에서 제공하는 티어 정보의 배경색 사용 (그라데이션 배경색을 단색으로 변환)
  const bgColor = tierInfo?.bgColor ? tierInfo.bgColor.replace('bg-gradient-to-r from-', 'bg-').split(' to-')[0] : 'bg-blue-500';
  const sizeClasses = getSizeClasses(size);

  return (
    <div className={`relative ${className}`}>
      {/* 레벨 배지 */}
      <div
        className={`${bgColor} ${sizeClasses} ${size === 'like' ? 'rounded-full border border-white shadow-sm' : 'border-2 border-white rounded-full shadow-sm'} flex items-center justify-center text-white font-bold ${getTextSize(size)}`}
        title={`${levelTitle} - 레벨 ${currentLevel}`}
      >
        Lv.{currentLevel}
      </div>
    </div>
  );
}

<<<<<<< HEAD
function getLevelBackgroundColor(level: number): string {
  // 전문가 레벨 API의 티어 체계에 맞춰 색상 결정 (그라데이션 제거)
  if (level >= 900) return 'bg-red-500'; // Tier 10 (Lv.900+)
  if (level >= 800) return 'bg-purple-500'; // Tier 9-10
  if (level >= 600) return 'bg-indigo-500'; // Tier 7-8
  if (level >= 400) return 'bg-blue-500'; // Tier 5-6
  if (level >= 200) return 'bg-cyan-500'; // Tier 3-4
  if (level >= 100) return 'bg-teal-500'; // Tier 2
  return 'bg-green-500'; // Tier 1
}
=======

>>>>>>> 6615aeb (expert profile update)

function getSizeClasses(size: 'sm' | 'md' | 'lg' | 'like'): string {
  switch (size) {
    case 'sm':
      return 'w-12 h-8 px-1';
    case 'md':
      return 'w-12 h-8 px-1';
    case 'lg':
<<<<<<< HEAD
      return 'w-12 h-8 px-3';
    case 'like':
      return 'px-3 py-1.5';
=======
      return 'w-12 h-8 px-1';
>>>>>>> 6615aeb (expert profile update)
    default:
      return 'w-12 h-8 px-1';
  }
}

function getTextSize(size: 'sm' | 'md' | 'lg' | 'like'): string {
  switch (size) {
    case 'sm':
      return 'text-xs';
    case 'md':
      return 'text-xs';
    case 'lg':
      return 'text-xs';
    case 'like':
      return 'text-sm';
    default:
      return 'text-xs';
  }
}


