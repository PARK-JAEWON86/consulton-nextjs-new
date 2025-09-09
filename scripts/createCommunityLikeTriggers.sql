-- 커뮤니티 좋아요 변경 시 전문가 통계 자동 업데이트 트리거

USE consulton;

-- 기존 트리거 삭제
DROP TRIGGER IF EXISTS update_expert_stats_after_like_insert;
DROP TRIGGER IF EXISTS update_expert_stats_after_like_delete;

DELIMITER //

-- 좋아요 추가 시 전문가 통계 업데이트
CREATE TRIGGER update_expert_stats_after_like_insert
AFTER INSERT ON community_likes
FOR EACH ROW
BEGIN
    DECLARE affected_expert_id INT DEFAULT 0;
    
    -- 게시글 좋아요인 경우
    IF NEW.targetType = 'post' THEN
        SELECT expertId INTO affected_expert_id
        FROM community_posts 
        WHERE id = NEW.targetId AND expertId IS NOT NULL;
        
        IF affected_expert_id > 0 THEN
            CALL UpdateExpertStats(affected_expert_id);
        END IF;
    END IF;
    
    -- 댓글 좋아요인 경우 (전문가가 작성한 댓글)
    IF NEW.targetType = 'comment' THEN
        -- 댓글 작성자가 전문가인지 확인
        SELECT e.id INTO affected_expert_id
        FROM community_comments cc
        JOIN experts e ON cc.userId = e.userId
        WHERE cc.id = NEW.targetId;
        
        IF affected_expert_id > 0 THEN
            CALL UpdateExpertStats(affected_expert_id);
        END IF;
    END IF;
END//

-- 좋아요 삭제 시 전문가 통계 업데이트
CREATE TRIGGER update_expert_stats_after_like_delete
AFTER DELETE ON community_likes
FOR EACH ROW
BEGIN
    DECLARE affected_expert_id INT DEFAULT 0;
    
    -- 게시글 좋아요인 경우
    IF OLD.targetType = 'post' THEN
        SELECT expertId INTO affected_expert_id
        FROM community_posts 
        WHERE id = OLD.targetId AND expertId IS NOT NULL;
        
        IF affected_expert_id > 0 THEN
            CALL UpdateExpertStats(affected_expert_id);
        END IF;
    END IF;
    
    -- 댓글 좋아요인 경우 (전문가가 작성한 댓글)
    IF OLD.targetType = 'comment' THEN
        -- 댓글 작성자가 전문가인지 확인
        SELECT e.id INTO affected_expert_id
        FROM community_comments cc
        JOIN experts e ON cc.userId = e.userId
        WHERE cc.id = OLD.targetId;
        
        IF affected_expert_id > 0 THEN
            CALL UpdateExpertStats(affected_expert_id);
        END IF;
    END IF;
END//

DELIMITER ;

-- 트리거 생성 확인
SELECT 'Community like triggers created successfully' as status;
SHOW TRIGGERS WHERE `Table` = 'community_likes';
