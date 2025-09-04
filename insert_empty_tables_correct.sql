-- 올바른 테이블 구조에 맞춘 데이터 삽입 SQL

-- 1. AI 사용량 데이터 (ai_usages)
INSERT IGNORE INTO ai_usages (userId, usedTokens, purchasedTokens, remainingPercent, monthlyResetDate, totalTurns, totalTokens, averageTokensPerTurn, createdAt, updatedAt)
SELECT 
    u.id as userId,
    FLOOR(RAND() * 5000) + 1000 as usedTokens,
    FLOOR(RAND() * 10000) + 5000 as purchasedTokens,
    FLOOR(RAND() * 50) + 30 as remainingPercent,
    NOW() as monthlyResetDate,
    FLOOR(RAND() * 100) + 20 as totalTurns,
    FLOOR(RAND() * 15000) + 5000 as totalTokens,
    FLOOR(RAND() * 200) + 100 as averageTokensPerTurn,
    NOW() as createdAt,
    NOW() as updatedAt
FROM users u
WHERE u.role = 'client' OR u.role = 'expert'
AND NOT EXISTS (SELECT 1 FROM ai_usages au WHERE au.userId = u.id);

-- 2. 전문가 가용성 데이터 (expert_availability) - 올바른 구조로 수정
INSERT IGNORE INTO expert_availability (expertId, dayOfWeek, availableHours, isAvailable, timeZone, createdAt, updatedAt)
SELECT 
    e.id as expertId,
    'monday' as dayOfWeek,
    '09:00-18:00' as availableHours,
    1 as isAvailable,
    'Asia/Seoul' as timeZone,
    NOW() as createdAt,
    NOW() as updatedAt
FROM experts e
WHERE NOT EXISTS (SELECT 1 FROM expert_availability ea WHERE ea.expertId = e.id AND ea.dayOfWeek = 'monday')
UNION ALL
SELECT 
    e.id as expertId,
    'tuesday' as dayOfWeek,
    '09:00-18:00' as availableHours,
    1 as isAvailable,
    'Asia/Seoul' as timeZone,
    NOW() as createdAt,
    NOW() as updatedAt
FROM experts e
WHERE NOT EXISTS (SELECT 1 FROM expert_availability ea WHERE ea.expertId = e.id AND ea.dayOfWeek = 'tuesday')
UNION ALL
SELECT 
    e.id as expertId,
    'wednesday' as dayOfWeek,
    '09:00-18:00' as availableHours,
    1 as isAvailable,
    'Asia/Seoul' as timeZone,
    NOW() as createdAt,
    NOW() as updatedAt
FROM experts e
WHERE NOT EXISTS (SELECT 1 FROM expert_availability ea WHERE ea.expertId = e.id AND ea.dayOfWeek = 'wednesday')
UNION ALL
SELECT 
    e.id as expertId,
    'thursday' as dayOfWeek,
    '09:00-18:00' as availableHours,
    1 as isAvailable,
    'Asia/Seoul' as timeZone,
    NOW() as createdAt,
    NOW() as updatedAt
FROM experts e
WHERE NOT EXISTS (SELECT 1 FROM expert_availability ea WHERE ea.expertId = e.id AND ea.dayOfWeek = 'thursday')
UNION ALL
SELECT 
    e.id as expertId,
    'friday' as dayOfWeek,
    '09:00-18:00' as availableHours,
    1 as isAvailable,
    'Asia/Seoul' as timeZone,
    NOW() as createdAt,
    NOW() as updatedAt
FROM experts e
WHERE NOT EXISTS (SELECT 1 FROM expert_availability ea WHERE ea.expertId = e.id AND ea.dayOfWeek = 'friday');

-- 3. 상담 세션 데이터 (consultation_sessions) - 올바른 구조로 수정
INSERT IGNORE INTO consultation_sessions (consultationId, sessionNumber, startTime, endTime, duration, status, notes, transcript, recordingUrl, attachments, createdAt, updatedAt)
SELECT 
    c.id as consultationId,
    1 as sessionNumber,
    c.scheduledTime as startTime,
    DATE_ADD(c.scheduledTime, INTERVAL 60 MINUTE) as endTime,
    60 as duration,
    'completed' as status,
    '상담이 성공적으로 완료되었습니다.' as notes,
    '상담 내용: 고객의 문제를 분석하고 해결방안을 제시했습니다. 고객은 만족스러워하며 후속 조치를 약속했습니다.' as transcript,
    CONCAT('https://example.com/recordings/session_', c.id, '.mp4') as recordingUrl,
    '["상담_요약.pdf", "해결방안_가이드.pdf"]' as attachments,
    NOW() as createdAt,
    NOW() as updatedAt
FROM consultations c
WHERE c.status = 'completed'
AND NOT EXISTS (SELECT 1 FROM consultation_sessions cs WHERE cs.consultationId = c.id)
LIMIT 5;

-- 4. 상담 요약 데이터 (consultation_summaries) - 올바른 구조로 수정
INSERT IGNORE INTO consultation_summaries (consultationId, summaryTitle, summaryContent, keyPoints, actionItems, recommendations, followUpPlan, todoStatus, attachments, isPublic, createdAt, updatedAt)
SELECT 
    c.id as consultationId,
    '상담 요약 보고서' as summaryTitle,
    '고객의 문제를 분석하고 해결방안을 제시했습니다. 고객은 만족스러워하며 후속 조치를 약속했습니다. 상담 중 주요 이슈들을 정리하고 구체적인 실행 계획을 수립했습니다.' as summaryContent,
    '["문제 분석", "해결방안 제시", "후속 조치 계획"]' as keyPoints,
    '["일일 운동 계획 수립", "스트레스 관리 기법 실천", "정기적인 상담 예약"]' as actionItems,
    '["정기적인 상담 예약", "자기계발 활동", "건강한 생활습관 유지"]' as recommendations,
    '["1주일 후 재상담", "과제 수행 확인", "진행상황 점검"]' as followUpPlan,
    'pending' as todoStatus,
    '["상담_요약.pdf", "행동계획서.pdf"]' as attachments,
    0 as isPublic,
    NOW() as createdAt,
    NOW() as updatedAt
FROM consultations c
WHERE c.status = 'completed'
AND NOT EXISTS (SELECT 1 FROM consultation_summaries cs WHERE cs.consultationId = c.id)
LIMIT 5;

-- 5. 결제 내역 데이터 (payments) - 올바른 구조로 수정
INSERT IGNORE INTO payments (userId, consultationId, paymentType, amount, currency, status, paymentMethod, paymentProvider, transactionId, orderId, description, metadata, processedAt, createdAt, updatedAt)
SELECT 
    c.userId,
    c.id as consultationId,
    'consultation' as paymentType,
    c.price as amount,
    'KRW' as currency,
    'completed' as status,
    'credit_card' as paymentMethod,
    'kakao_pay' as paymentProvider,
    CONCAT('TXN_', LPAD(c.id, 8, '0')) as transactionId,
    CONCAT('ORDER_', LPAD(c.id, 8, '0')) as orderId,
    CONCAT('상담 결제 - ', c.title) as description,
    '{"consultationId": ' || c.id || ', "expertId": ' || c.expertId || '}' as metadata,
    NOW() as processedAt,
    NOW() as createdAt,
    NOW() as updatedAt
FROM consultations c
WHERE c.status = 'completed'
AND NOT EXISTS (SELECT 1 FROM payments p WHERE p.consultationId = c.id)
LIMIT 5;

-- 6. 알림 데이터 (notifications) - 올바른 구조로 수정
INSERT IGNORE INTO notifications (userId, type, title, message, data, isRead, priority, expiresAt, readAt, createdAt, updatedAt)
SELECT 
    u.id as userId,
    'consultation_reminder' as type,
    '상담 예약 알림' as title,
    '내일 오후 2시에 상담이 예정되어 있습니다.' as message,
    '{"consultationId": 1, "scheduledTime": "2025-09-05T14:00:00Z"}' as data,
    0 as isRead,
    'medium' as priority,
    DATE_ADD(NOW(), INTERVAL 7 DAY) as expiresAt,
    NULL as readAt,
    NOW() as createdAt,
    NOW() as updatedAt
FROM users u
WHERE u.role = 'client'
AND NOT EXISTS (SELECT 1 FROM notifications n WHERE n.userId = u.id AND n.type = 'consultation_reminder')
LIMIT 3
UNION ALL
SELECT 
    u.id as userId,
    'payment_confirmation' as type,
    '결제 완료 알림' as title,
    '상담 결제가 완료되었습니다.' as message,
    '{"paymentId": 1, "amount": 50000, "currency": "KRW"}' as data,
    0 as isRead,
    'high' as priority,
    DATE_ADD(NOW(), INTERVAL 30 DAY) as expiresAt,
    NULL as readAt,
    NOW() as createdAt,
    NOW() as updatedAt
FROM users u
WHERE u.role = 'client'
AND NOT EXISTS (SELECT 1 FROM notifications n WHERE n.userId = u.id AND n.type = 'payment_confirmation')
LIMIT 2;

-- 7. 결제 수단 데이터 (payment_methods)
INSERT IGNORE INTO payment_methods (userId, type, cardNumber, expiryDate, cardHolderName, isDefault, createdAt, updatedAt)
SELECT 
    u.id as userId,
    'credit_card' as type,
    CONCAT('****-****-****-', LPAD(FLOOR(RAND() * 10000), 4, '0')) as cardNumber,
    DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 3 YEAR), '%m/%y') as expiryDate,
    u.name as cardHolderName,
    1 as isDefault,
    NOW() as createdAt,
    NOW() as updatedAt
FROM users u
WHERE u.role = 'client'
AND NOT EXISTS (SELECT 1 FROM payment_methods pm WHERE pm.userId = u.id)
LIMIT 3;
