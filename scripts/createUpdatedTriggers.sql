-- 실제 데이터 기반 전문가 통계 자동 업데이트 트리거
-- 리뷰 데이터 변경 시 실제 세션 수와 레벨까지 함께 계산하여 업데이트

USE consulton;

-- 기존 트리거 삭제
DROP TRIGGER IF EXISTS update_expert_stats_after_review_insert;
DROP TRIGGER IF EXISTS update_expert_stats_after_review_update;
DROP TRIGGER IF EXISTS update_expert_stats_after_review_delete;

DELIMITER //

-- 전문가 통계 계산 및 업데이트 프로시저
CREATE PROCEDURE UpdateExpertStats(IN expert_id INT)
BEGIN
    DECLARE review_count INT DEFAULT 0;
    DECLARE avg_rating DECIMAL(3,2) DEFAULT 0.00;
    DECLARE session_count INT DEFAULT 0;
    DECLARE ranking_score DECIMAL(10,2) DEFAULT 0.00;
    DECLARE expert_level INT DEFAULT 1;
    
    -- 실제 리뷰 통계 계산
    SELECT COUNT(*), COALESCE(ROUND(AVG(rating), 2), 0.00)
    INTO review_count, avg_rating
    FROM reviews 
    WHERE expertId = expert_id 
      AND isDeleted = 0 
      AND isPublic = 1;
    
    -- 실제 세션 수 계산
    SELECT COUNT(*)
    INTO session_count
    FROM consultation_sessions cs
    JOIN consultations c ON cs.consultationId = c.id
    WHERE c.expertId = expert_id 
      AND cs.status = 'completed';
    
    -- 랭킹 점수 계산 (간소화된 버전)
    -- 세션 점수 (40%) + 평점 점수 (30%) + 리뷰 점수 (15%)
    SET ranking_score = 
        (LEAST(session_count / 100.0, 1.0) * 400) +  -- 세션 점수
        ((avg_rating / 5.0) * 300) +                  -- 평점 점수  
        (LEAST(review_count / 50.0, 1.0) * 150);      -- 리뷰 점수
    
    -- 레벨 계산 (간소화된 버전)
    SET expert_level = GREATEST(1, FLOOR(ranking_score / 5) + 1);
    IF ranking_score >= 500 THEN
        SET expert_level = 100 + FLOOR((ranking_score - 500) * 2);
    END IF;
    IF ranking_score >= 950 THEN
        SET expert_level = 999;
    END IF;
    
    -- 전문가 테이블 업데이트
    UPDATE experts 
    SET reviewCount = review_count,
        avgRating = avg_rating,
        rating = avg_rating,
        totalSessions = session_count,
        level = expert_level,
        updatedAt = NOW()
    WHERE id = expert_id;
    
END//

-- 리뷰 추가 시 전문가 통계 업데이트
CREATE TRIGGER update_expert_stats_after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    CALL UpdateExpertStats(NEW.expertId);
END//

-- 리뷰 수정 시 전문가 통계 업데이트  
CREATE TRIGGER update_expert_stats_after_review_update
AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    -- 평점이나 공개 상태가 변경된 경우에만 업데이트
    IF OLD.rating != NEW.rating OR OLD.isPublic != NEW.isPublic OR OLD.isDeleted != NEW.isDeleted THEN
        CALL UpdateExpertStats(NEW.expertId);
        
        -- 전문가가 변경된 경우 이전 전문가 통계도 업데이트
        IF OLD.expertId != NEW.expertId THEN
            CALL UpdateExpertStats(OLD.expertId);
        END IF;
    END IF;
END//

-- 리뷰 삭제 시 전문가 통계 업데이트
CREATE TRIGGER update_expert_stats_after_review_delete
AFTER DELETE ON reviews
FOR EACH ROW
BEGIN
    CALL UpdateExpertStats(OLD.expertId);
END//

DELIMITER ;

-- 트리거 생성 확인
SELECT 'Triggers created successfully' as status;
SHOW TRIGGERS WHERE `Table` = 'reviews';

-- 프로시저 생성 확인
SHOW PROCEDURE STATUS WHERE Name = 'UpdateExpertStats';
