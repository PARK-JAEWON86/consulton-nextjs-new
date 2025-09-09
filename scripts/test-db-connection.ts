#!/usr/bin/env node

/**
 * 데이터베이스 연결 테스트 스크립트
 * 
 * 사용법:
 * npx ts-node scripts/test-db-connection.ts
 */

import sequelize, { testConnection, syncDatabase } from '../src/lib/db/connection';
import '../src/lib/db/models/associations'; // 모델 관계 로드

async function main() {
  console.log('🔄 데이터베이스 연결 테스트를 시작합니다...\n');

  try {
    // 1. 데이터베이스 연결 테스트
    console.log('1️⃣ 데이터베이스 연결 테스트');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ 데이터베이스 연결에 실패했습니다.');
      process.exit(1);
    }

    // 2. 테이블 존재 여부 확인
    console.log('\n2️⃣ 테이블 존재 여부 확인');
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('📋 존재하는 테이블들:', tables);

    // 3. 주요 테이블 확인
    const requiredTables = [
      'users',
      'experts', 
      'expert_profiles',
      'consultation_requests',
      'consultations',
      'categories'
    ];

    console.log('\n3️⃣ 필수 테이블 확인');
    const missingTables = [];
    for (const table of requiredTables) {
      if (tables.includes(table)) {
        console.log(`✅ ${table} 테이블 존재`);
      } else {
        console.log(`❌ ${table} 테이블 누락`);
        missingTables.push(table);
      }
    }

    if (missingTables.length > 0) {
      console.log(`\n⚠️  누락된 테이블: ${missingTables.join(', ')}`);
      console.log('마이그레이션을 실행해야 할 수 있습니다.');
    }

    // 4. 간단한 쿼리 테스트 (users 테이블이 있는 경우)
    if (tables.includes('users')) {
      console.log('\n4️⃣ 간단한 쿼리 테스트');
      try {
        const [results] = await sequelize.query('SELECT COUNT(*) as count FROM users');
        console.log(`✅ users 테이블 레코드 수: ${(results as any)[0].count}`);
      } catch (error) {
        console.log(`❌ users 테이블 쿼리 실패:`, error);
      }
    }

    // 5. 연결 종료
    await sequelize.close();
    console.log('\n✅ 데이터베이스 연결 테스트가 완료되었습니다.');

  } catch (error) {
    console.error('\n❌ 테스트 중 오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트가 직접 실행된 경우에만 main 함수 호출
if (require.main === module) {
  main().catch(console.error);
}

export default main;
