-- 추가 사용자 데이터 삽입 (리뷰 작성자를 위한 사용자들)
-- 기존 사용자 외에 리뷰를 작성할 추가 사용자들을 생성

-- 추가 사용자 데이터 삽입
INSERT IGNORE INTO users (
    id,
    email,
    name,
    createdAt,
    updatedAt,
    password,
    role,
    isEmailVerified,
    lastLoginAt,
    nickname,
    phone,
    location,
    birthDate,
    bio,
    profileImage,
    interestedCategories,
    profileVisibility
) VALUES 
-- 사용자 21번
(21, 'user21@example.com', '이영희', '2024-01-10 10:00:00', '2024-01-15 14:30:00', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'client', true, '2024-01-15 14:30:00', '영희', '010-4444-4444', '부산광역시', '1990-03-15', '안녕하세요! 새로운 경험을 좋아하는 이영희입니다.', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', '["개발", "디자인"]', 'public'),

-- 사용자 22번
(22, 'user22@example.com', '박민수', '2024-01-12 14:30:00', '2024-01-16 10:15:00', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'client', true, '2024-01-16 10:15:00', '민수', '010-5555-5555', '대구광역시', '1988-07-22', '열정적인 개발자 박민수입니다. 항상 배우려는 자세로 임합니다.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '["개발", "창업"]', 'public'),

-- 사용자 23번
(23, 'user23@example.com', '최지영', '2024-01-15 09:15:00', '2024-01-17 16:45:00', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'client', true, '2024-01-17 16:45:00', '지영', '010-6666-6666', '인천광역시', '1992-11-08', '디자인과 예술을 사랑하는 최지영입니다.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', '["디자인", "예술"]', 'public'),

-- 사용자 24번
(24, 'user24@example.com', '정현우', '2024-01-18 16:45:00', '2024-01-18 09:20:00', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'client', true, '2024-01-18 09:20:00', '현우', '010-7777-7777', '광주광역시', '1985-05-30', '스타트업 창업을 꿈꾸는 정현우입니다.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', '["창업", "마케팅"]', 'public'),

-- 사용자 25번
(25, 'user25@example.com', '한소영', '2024-01-20 11:20:00', '2024-01-19 13:10:00', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'client', true, '2024-01-19 13:10:00', '소영', '010-8888-8888', '대전광역시', '1993-09-12', '마케팅 전문가가 되고 싶은 한소영입니다.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', '["마케팅", "브랜딩"]', 'public'),

-- 사용자 26번
(26, 'user26@example.com', '김태현', '2024-01-22 13:10:00', '2024-01-20 15:30:00', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'client', true, '2024-01-20 15:30:00', '태현', '010-9999-9999', '울산광역시', '1987-12-03', '금융 분야에서 일하고 있는 김태현입니다.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', '["투자", "금융"]', 'public'),

-- 사용자 27번
(27, 'user27@example.com', '송미래', '2024-01-25 15:30:00', '2024-01-21 11:00:00', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'client', true, '2024-01-21 11:00:00', '미래', '010-1010-1010', '세종특별자치시', '1991-04-18', '교육 분야에서 일하고 있는 송미래입니다.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', '["교육", "커리어"]', 'public');

-- 추가 사용자들의 크레딧 데이터도 생성
INSERT IGNORE INTO user_credits (
    userId,
    type,
    amount,
    description,
    createdAt,
    updatedAt
) VALUES 
(21, 'purchase', 10000, '초기 크레딧 지급', '2024-01-10 10:00:00', '2024-01-10 10:00:00'),
(22, 'purchase', 15000, '초기 크레딧 지급', '2024-01-12 14:30:00', '2024-01-12 14:30:00'),
(23, 'purchase', 12000, '초기 크레딧 지급', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(24, 'purchase', 20000, '초기 크레딧 지급', '2024-01-18 16:45:00', '2024-01-18 16:45:00'),
(25, 'purchase', 8000, '초기 크레딧 지급', '2024-01-20 11:20:00', '2024-01-20 11:20:00'),
(26, 'purchase', 18000, '초기 크레딧 지급', '2024-01-22 13:10:00', '2024-01-22 13:10:00'),
(27, 'purchase', 14000, '초기 크레딧 지급', '2024-01-25 15:30:00', '2024-01-25 15:30:00');

-- 추가 사용자 데이터 확인
SELECT 
    u.id,
    u.email,
    u.name,
    u.role,
    u.location,
    u.createdAt
FROM users u 
WHERE u.id BETWEEN 21 AND 27
ORDER BY u.createdAt;

-- 전체 사용자 수 확인
SELECT 
    COUNT(*) as totalUsers,
    COUNT(CASE WHEN role = 'client' THEN 1 END) as clientUsers,
    COUNT(CASE WHEN role = 'expert' THEN 1 END) as expertUsers,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as adminUsers
FROM users;