-- 기존 데이터 확인 쿼리

-- 1. ai_usages 테이블의 기존 데이터 확인
SELECT COUNT(*) as ai_usages_count FROM ai_usages;

-- 2. expert_availability 테이블의 기존 데이터 확인  
SELECT COUNT(*) as expert_availability_count FROM expert_availability;

-- 3. consultation_sessions 테이블의 기존 데이터 확인
SELECT COUNT(*) as consultation_sessions_count FROM consultation_sessions;

-- 4. consultation_summaries 테이블의 기존 데이터 확인
SELECT COUNT(*) as consultation_summaries_count FROM consultation_summaries;

-- 5. payments 테이블의 기존 데이터 확인
SELECT COUNT(*) as payments_count FROM payments;

-- 6. notifications 테이블의 기존 데이터 확인
SELECT COUNT(*) as notifications_count FROM notifications;

-- 7. payment_methods 테이블의 기존 데이터 확인
SELECT COUNT(*) as payment_methods_count FROM payment_methods;
