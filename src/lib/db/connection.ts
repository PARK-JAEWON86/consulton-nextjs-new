import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// 환경 변수 로드 (Next.js가 자동으로 로드하지 않는 경우를 대비)
dotenv.config();

// 데이터베이스 연결 설정
const env = process.env.NODE_ENV || 'development';
let sequelize: Sequelize;

if (env === 'production') {
  // 프로덕션 환경에서는 DATABASE_URL 사용
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL 환경변수가 설정되지 않았습니다.');
  }
  
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    dialectOptions: { 
      dateStrings: true,
      typeCast: true
    },
    timezone: '+09:00',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // 개발 환경에서는 개별 환경변수 또는 기본값 사용
  const dbConfig = {
    database: process.env.DB_NAME || 'consulton_db',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || null,
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql' as const,
    dialectOptions: { 
      dateStrings: true,
      typeCast: true
    },
    timezone: '+09:00',
    logging: env === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };

  sequelize = new Sequelize(dbConfig);
}

// 데이터베이스 연결 테스트
export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log('✅ 데이터베이스 연결이 성공적으로 설정되었습니다.');
    return true;
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error);
    return false;
  }
};

// 데이터베이스 동기화 (개발 환경에서만)
export const syncDatabase = async (force: boolean = false): Promise<void> => {
  if (env === 'development') {
    try {
      await sequelize.sync({ force, alter: !force });
      console.log('✅ 데이터베이스 동기화가 완료되었습니다.');
    } catch (error) {
      console.error('❌ 데이터베이스 동기화 실패:', error);
      throw error;
    }
  }
};

export default sequelize;
