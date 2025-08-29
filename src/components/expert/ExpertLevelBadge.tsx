"use client";

import { useState, useEffect } from 'react';
import { Award, TrendingUp } from 'lucide-react';

interface ExpertLevelBadgeProps {
  expertId: string;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  showTitle?: boolean;
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
}

export default function ExpertLevelBadge({
  expertId,
  size = 'md',
  showProgress = false,
  showTitle = false,
  className = ''
}: ExpertLevelBadgeProps) {
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExpertLevel = async () => {
      try {
        setIsLoading(true);
        
        // 새로운 API를 통해 전문가 레벨 정보를 가져옴
        const response = await fetch(`/api/expert-levels?action=getExpertLevel&expertId=${expertId}`);
        const result = await response.json();
        
        if (result.currentLevel && result.levelTitle) {
          setLevelData(result);
        } else {
          // API에서 데이터를 가져올 수 없는 경우 기본 레벨 표시
          setLevelData({
            currentLevel: 1,
            levelTitle: "Tier 1 (Lv.1-99)",
            levelProgress: {
              current: 1,
              next: 2,
              percentage: 0
            }
          });
        }
      } catch (error) {
        console.error('전문가 레벨 로드 실패:', error);
        // 에러 발생 시 기본 레벨 표시
        setLevelData({
          currentLevel: 1,
          levelTitle: "Tier 1 (Lv.1-99)",
          levelProgress: {
            current: 1,
            next: 2,
            percentage: 0
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (expertId) {
      loadExpertLevel();
    }
  }, [expertId]);

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded-full ${getSizeClasses(size)} ${className}`} />
    );
  }

  if (!levelData) {
    return null;
  }

  const { currentLevel, levelTitle, levelProgress } = levelData;
  const bgColor = getLevelBackgroundColor(currentLevel);
  const sizeClasses = getSizeClasses(size);

  return (
    <div className={`relative ${className}`}>
      {/* 레벨 배지 */}
      <div
        className={`${bgColor} ${sizeClasses} border-2 border-white rounded-full shadow-sm flex items-center justify-center text-white font-bold ${getTextSize(size)}`}
        title={`${levelTitle} - 레벨 ${currentLevel}`}
      >
        <Award className={`${getIconSize(size)} mr-1`} />
        Lv.{currentLevel}
      </div>

      {/* 레벨 제목 */}
      {showTitle && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <span className="text-xs text-gray-600 font-medium bg-white px-2 py-1 rounded border shadow-sm">
            {levelTitle}
          </span>
        </div>
      )}

      {/* 레벨 진행률 */}
      {showProgress && levelProgress && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-16">
          <div className="bg-gray-200 rounded-full h-1.5">
            <div
              className={`${bgColor} h-1.5 rounded-full transition-all duration-300`}
              style={{ width: `${levelProgress.percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-center mt-1">
            <TrendingUp className="w-3 h-3 text-gray-400 mr-1" />
            <span className="text-xs text-gray-500">
              {levelProgress.percentage}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function getLevelBackgroundColor(level: number): string {
  // 전문가 레벨 API의 티어 체계에 맞춰 색상 결정
  if (level >= 900) return 'bg-gradient-to-r from-red-500 to-pink-600'; // Tier 10 (Lv.900+)
  if (level >= 800) return 'bg-gradient-to-r from-purple-500 to-indigo-600'; // Tier 9-10
  if (level >= 600) return 'bg-gradient-to-r from-indigo-500 to-blue-600'; // Tier 7-8
  if (level >= 400) return 'bg-gradient-to-r from-blue-500 to-cyan-600'; // Tier 5-6
  if (level >= 200) return 'bg-gradient-to-r from-cyan-500 to-teal-600'; // Tier 3-4
  if (level >= 100) return 'bg-gradient-to-r from-teal-500 to-green-600'; // Tier 2
  return 'bg-gradient-to-r from-green-500 to-emerald-600'; // Tier 1
}

function getSizeClasses(size: 'sm' | 'md' | 'lg'): string {
  switch (size) {
    case 'sm':
      return 'w-8 h-6 px-1';
    case 'md':
      return 'w-10 h-6 px-2';
    case 'lg':
      return 'w-12 h-8 px-3';
    default:
      return 'w-10 h-6 px-2';
  }
}

function getTextSize(size: 'sm' | 'md' | 'lg'): string {
  switch (size) {
    case 'sm':
      return 'text-[8px]';
    case 'md':
      return 'text-[10px]';
    case 'lg':
      return 'text-xs';
    default:
      return 'text-[10px]';
  }
}

function getIconSize(size: 'sm' | 'md' | 'lg'): string {
  switch (size) {
    case 'sm':
      return 'w-3 h-3';
    case 'md':
      return 'w-4 h-4';
    case 'lg':
      return 'w-5 h-5';
    default:
      return 'w-4 h-4';
  }
}
