-- 개선된 전문가 통계 업데이트 프로시저
-- 랭킹점수와 좋아요 수도 함께 계산하여 저장

USE consulton;

-- 기존 프로시저 삭제
DROP PROCEDURE IF EXISTS UpdateExpertStats;

DELIMITER //

-- 개선된 전문가 통계 계산 및 업데이트 프로시저
CREATE PROCEDURE UpdateExpertStats(IN expert_id INT)
BEGIN
    DECLARE review_count INT DEFAULT 0;
    DECLARE avg_rating DECIMAL(3,2) DEFAULT 0.00;
    DECLARE session_count INT DEFAULT 0;
    DECLARE like_count INT DEFAULT 0;
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
    
    -- 커뮤니티에서 받은 좋아요 수 계산 (전문가가 작성한 게시글/댓글)
    SELECT COUNT(*)
    INTO like_count
    FROM community_likes cl
    WHERE cl.targetType = 'post' 
      AND cl.targetId IN (
        SELECT cp.id 
        FROM community_posts cp 
        WHERE cp.expertId = expert_id
      )
    OR (cl.targetType = 'comment' 
      AND cl.targetId IN (
        SELECT cc.id 
        FROM community_comments cc
        JOIN community_posts cp ON cc.postId = cp.id
        WHERE cp.expertId = expert_id OR cc.userId = (SELECT userId FROM experts WHERE id = expert_id)
      ));
    
    -- 랭킹 점수 계산 (정확한 공식)
    -- 세션 점수 (40%) + 평점 점수 (30%) + 리뷰 점수 (15%) + 좋아요 점수 (15%)
    SET ranking_score = 
        (LEAST(session_count / 100.0, 1.0) * 400) +    -- 세션 점수: 100회당 400점
        ((avg_rating / 5.0) * 300) +                    -- 평점 점수: 5점 만점에서 300점
        (LEAST(review_count / 50.0, 1.0) * 150) +       -- 리뷰 점수: 50개당 150점
        (LEAST(like_count / 100.0, 1.0) * 150);         -- 좋아요 점수: 100개당 150점
    
    -- 레벨 계산 (개선된 버전)
    SET expert_level = GREATEST(1, FLOOR(ranking_score / 5) + 1);
    
    -- 고급 레벨 계산
    IF ranking_score >= 950 THEN
        SET expert_level = 999;
    ELSEIF ranking_score >= 900 THEN
        SET expert_level = 900 + FLOOR((ranking_score - 900) * 2);
    ELSEIF ranking_score >= 850 THEN
        SET expert_level = 800 + FLOOR((ranking_score - 850) * 2);
    ELSEIF ranking_score >= 800 THEN
        SET expert_level = 700 + FLOOR((ranking_score - 800) * 2);
    ELSEIF ranking_score >= 750 THEN
        SET expert_level = 600 + FLOOR((ranking_score - 750) * 2);
    ELSEIF ranking_score >= 700 THEN
        SET expert_level = 500 + FLOOR((ranking_score - 700) * 2);
    ELSEIF ranking_score >= 650 THEN
        SET expert_level = 400 + FLOOR((ranking_score - 650) * 2);
    ELSEIF ranking_score >= 600 THEN
        SET expert_level = 300 + FLOOR((ranking_score - 600) * 2);
    ELSEIF ranking_score >= 550 THEN
        SET expert_level = 200 + FLOOR((ranking_score - 550) * 2);
    ELSEIF ranking_score >= 500 THEN
        SET expert_level = 100 + FLOOR((ranking_score - 500) * 2);
    END IF;
    
    -- 전문가 테이블 업데이트 (랭킹점수와 좋아요 수 포함)
    UPDATE experts 
    SET reviewCount = review_count,
        avgRating = avg_rating,
        rating = avg_rating,
        totalSessions = session_count,
        level = expert_level,
        rankingScore = ranking_score,
        likeCount = like_count,
        updatedAt = NOW()
    WHERE id = expert_id;
    
END//

DELIMITER ;

-- 모든 전문가의 통계를 업데이트하는 프로시저
DELIMITER //

CREATE PROCEDURE UpdateAllExpertStats()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE expert_id INT;
    DECLARE expert_cursor CURSOR FOR 
        SELECT id FROM experts WHERE isProfilePublic = 1;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN expert_cursor;
    
    expert_loop: LOOP
        FETCH expert_cursor INTO expert_id;
        IF done THEN
            LEAVE expert_loop;
        END IF;
        
        CALL UpdateExpertStats(expert_id);
    END LOOP;
    
    CLOSE expert_cursor;
END//

DELIMITER ;

-- 프로시저 생성 확인
SELECT 'Updated procedures created successfully' as status;
SHOW PROCEDURE STATUS WHERE Name IN ('UpdateExpertStats', 'UpdateAllExpertStats');
