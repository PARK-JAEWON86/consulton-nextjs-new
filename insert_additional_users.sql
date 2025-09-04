-- 추가 사용자 데이터 삽입 (리뷰 작성자를 위한 사용자들)
-- 기존 사용자 외에 리뷰를 작성할 추가 사용자들을 생성

-- 추가 사용자 데이터 삽입
INSERT IGNORE INTO users (
    id,
    email,
    password,
    name,
    role,
    isActive,
    emailVerified,
    profileImage,
    phone,
    birthDate,
    gender,
    location,
    bio,
    preferences,
    createdAt,
    updatedAt
) VALUES 
-- 사용자 4번
('user_004', 'user4@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '이영희', 'client', true, true, 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', '010-4444-4444', '1990-05-15', 'female', '부산광역시', '안녕하세요! 새로운 경험을 좋아하는 이영희입니다.', '{"notifications": true, "theme": "light", "language": "ko", "timezone": "Asia/Seoul"}', '2024-01-10 10:00:00', '2024-01-10 10:00:00'),

-- 사용자 5번
('user_005', 'user5@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '박민수', 'client', true, true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '010-5555-5555', '1988-12-03', 'male', '대구광역시', '열정적인 개발자 박민수입니다. 항상 배우는 자세로 임하고 있습니다.', '{"notifications": true, "theme": "dark", "language": "ko", "timezone": "Asia/Seoul"}', '2024-01-12 14:30:00', '2024-01-12 14:30:00'),

-- 사용자 6번
('user_006', 'user6@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '최지영', 'client', true, true, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', '010-6666-6666', '1992-08-20', 'female', '인천광역시', '디자인과 예술을 사랑하는 최지영입니다. 창의적인 아이디어를 좋아해요.', '{"notifications": false, "theme": "light", "language": "ko", "timezone": "Asia/Seoul"}', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),

-- 사용자 7번
('user_007', 'user7@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '정현우', 'client', true, true, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', '010-7777-7777', '1985-03-25', 'male', '광주광역시', '마케팅 전문가 정현우입니다. 데이터 기반의 인사이트를 추구합니다.', '{"notifications": true, "theme": "light", "language": "ko", "timezone": "Asia/Seoul"}', '2024-01-18 16:45:00', '2024-01-18 16:45:00'),

-- 사용자 8번
('user_008', 'user8@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '한소영', 'client', true, true, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', '010-8888-8888', '1993-11-12', 'female', '대전광역시', 'HR 전문가 한소영입니다. 사람과 조직의 성장을 돕는 일을 하고 있어요.', '{"notifications": true, "theme": "light", "language": "ko", "timezone": "Asia/Seoul"}', '2024-01-20 11:20:00', '2024-01-20 11:20:00'),

-- 사용자 9번
('user_009', 'user9@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '윤태호', 'client', true, true, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', '010-9999-9999', '1987-07-08', 'male', '울산광역시', '금융 전문가 윤태호입니다. 투자와 자산 관리에 관심이 많아요.', '{"notifications": false, "theme": "dark", "language": "ko", "timezone": "Asia/Seoul"}', '2024-01-22 13:10:00', '2024-01-22 13:10:00'),

-- 사용자 10번
('user_010', 'user10@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '강미래', 'client', true, true, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', '010-1010-1010', '1991-04-18', 'female', '세종특별자치시', '교육 전문가 강미래입니다. 학습과 성장을 돕는 일에 열정적이에요.', '{"notifications": true, "theme": "light", "language": "ko", "timezone": "Asia/Seoul"}', '2024-01-25 15:30:00', '2024-01-25 15:30:00');

-- 추가 사용자들의 크레딧 잔액 설정
INSERT IGNORE INTO user_credits (
    userId,
    type,
    amount,
    description,
    createdAt,
    updatedAt
) VALUES 
('user_004', 'initial', 1000, '신규 가입 보너스', '2024-01-10 10:00:00', '2024-01-10 10:00:00'),
('user_005', 'initial', 1000, '신규 가입 보너스', '2024-01-12 14:30:00', '2024-01-12 14:30:00'),
('user_006', 'initial', 1000, '신규 가입 보너스', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
('user_007', 'initial', 1000, '신규 가입 보너스', '2024-01-18 16:45:00', '2024-01-18 16:45:00'),
('user_008', 'initial', 1000, '신규 가입 보너스', '2024-01-20 11:20:00', '2024-01-20 11:20:00'),
('user_009', 'initial', 1000, '신규 가입 보너스', '2024-01-22 13:10:00', '2024-01-22 13:10:00'),
('user_010', 'initial', 1000, '신규 가입 보너스', '2024-01-25 15:30:00', '2024-01-25 15:30:00');

-- 추가 사용자 데이터 확인
SELECT 
    id,
    email,
    name,
    role,
    isActive,
    location,
    createdAt
FROM users 
WHERE id IN ('user_004', 'user_005', 'user_006', 'user_007', 'user_008', 'user_009', 'user_010')
ORDER BY createdAt;

-- 전체 사용자 수 확인
SELECT 
    role,
    COUNT(*) as userCount
FROM users 
WHERE isActive = true
GROUP BY role;
-- 기존 사용자 외에 추가로 필요한 사용자들

-- 추가 사용자 데이터 삽입
INSERT IGNORE INTO users (
    id,
    email,
    password,
    name,
    role,
    isActive,
    emailVerified,
    profileImage,
    phone,
    dateOfBirth,
    gender,
    location,
    bio,
    preferences,
    createdAt,
    updatedAt
) VALUES 
-- 사용자 4번
('user_004', 'user4@example.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', '이영희', 'client', true, true, 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', '010-4444-4444', '1990-03-15', 'female', '부산광역시', '안녕하세요! 새로운 경험을 좋아하는 이영희입니다.', '{"notifications": true, "marketing": false, "timezone": "Asia/Seoul"}', '2024-01-10 10:00:00', '2024-01-10 10:00:00'),

-- 사용자 5번
('user_005', 'user5@example.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', '박민수', 'client', true, true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '010-5555-5555', '1988-07-22', 'male', '대구광역시', '열정적인 개발자 박민수입니다. 항상 배우려는 자세로 임합니다.', '{"notifications": true, "marketing": true, "timezone": "Asia/Seoul"}', '2024-01-12 14:30:00', '2024-01-12 14:30:00'),

-- 사용자 6번
('user_006', 'user6@example.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', '최지영', 'client', true, true, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', '010-6666-6666', '1992-11-08', 'female', '인천광역시', '디자인과 예술을 사랑하는 최지영입니다.', '{"notifications": true, "marketing": false, "timezone": "Asia/Seoul"}', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),

-- 사용자 7번
('user_007', 'user7@example.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', '정현우', 'client', true, true, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', '010-7777-7777', '1985-05-30', 'male', '광주광역시', '스타트업 창업을 꿈꾸는 정현우입니다.', '{"notifications": true, "marketing": true, "timezone": "Asia/Seoul"}', '2024-01-18 16:45:00', '2024-01-18 16:45:00'),

-- 사용자 8번
('user_008', 'user8@example.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', '한소영', 'client', true, true, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', '010-8888-8888', '1993-09-12', 'female', '대전광역시', '마케팅 전문가가 되고 싶은 한소영입니다.', '{"notifications": true, "marketing": false, "timezone": "Asia/Seoul"}', '2024-01-20 11:20:00', '2024-01-20 11:20:00'),

-- 사용자 9번
('user_009', 'user9@example.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', '김태현', 'client', true, true, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', '010-9999-9999', '1987-12-03', 'male', '울산광역시', '금융 분야에서 일하고 있는 김태현입니다.', '{"notifications": true, "marketing": true, "timezone": "Asia/Seoul"}', '2024-01-22 13:10:00', '2024-01-22 13:10:00'),

-- 사용자 10번
('user_010', 'user10@example.com', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', '송미래', 'client', true, true, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', '010-1010-1010', '1991-04-18', 'female', '세종특별자치시', '교육 분야에서 일하고 있는 송미래입니다.', '{"notifications": true, "marketing": false, "timezone": "Asia/Seoul"}', '2024-01-25 15:30:00', '2024-01-25 15:30:00');

-- 추가 사용자들의 크레딧 데이터도 생성
INSERT IGNORE INTO user_credits (
    userId,
    type,
    amount,
    description,
    createdAt,
    updatedAt
) VALUES 
('user_004', 'purchase', 10000, '초기 크레딧 지급', '2024-01-10 10:00:00', '2024-01-10 10:00:00'),
('user_005', 'purchase', 15000, '초기 크레딧 지급', '2024-01-12 14:30:00', '2024-01-12 14:30:00'),
('user_006', 'purchase', 12000, '초기 크레딧 지급', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
('user_007', 'purchase', 20000, '초기 크레딧 지급', '2024-01-18 16:45:00', '2024-01-18 16:45:00'),
('user_008', 'purchase', 8000, '초기 크레딧 지급', '2024-01-20 11:20:00', '2024-01-20 11:20:00'),
('user_009', 'purchase', 18000, '초기 크레딧 지급', '2024-01-22 13:10:00', '2024-01-22 13:10:00'),
('user_010', 'purchase', 14000, '초기 크레딧 지급', '2024-01-25 15:30:00', '2024-01-25 15:30:00');

-- 추가 사용자 데이터 확인
SELECT 
    u.id,
    u.email,
    u.name,
    u.role,
    u.location,
    u.createdAt
FROM users u 
WHERE u.id IN ('user_004', 'user_005', 'user_006', 'user_007', 'user_008', 'user_009', 'user_010')
ORDER BY u.createdAt;

-- 전체 사용자 수 확인
SELECT 
    COUNT(*) as totalUsers,
    COUNT(CASE WHEN role = 'client' THEN 1 END) as clientUsers,
    COUNT(CASE WHEN role = 'expert' THEN 1 END) as expertUsers,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as adminUsers
FROM users;
