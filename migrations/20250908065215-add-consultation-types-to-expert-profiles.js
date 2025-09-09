'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // expert_profiles 테이블에 consultationTypes 컬럼 추가
    await queryInterface.addColumn('expert_profiles', 'consultationTypes', {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: '[]',
      comment: '상담 유형 (JSON 배열)'
    });

    // expert_profiles 테이블에 languages 컬럼 추가
    await queryInterface.addColumn('expert_profiles', 'languages', {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: '[]',
      comment: '언어 (JSON 배열)'
    });

    // expert_profiles 테이블에 hourlyRate 컬럼 추가
    await queryInterface.addColumn('expert_profiles', 'hourlyRate', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '시간당 요금 (원)'
    });

    // expert_profiles 테이블에 pricePerMinute 컬럼 추가
    await queryInterface.addColumn('expert_profiles', 'pricePerMinute', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '분당 요금 (원)'
    });

    // expert_profiles 테이블에 totalSessions 컬럼 추가
    await queryInterface.addColumn('expert_profiles', 'totalSessions', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '총 상담 수'
    });
  },

  async down (queryInterface, Sequelize) {
    // 추가된 컬럼들 제거
    await queryInterface.removeColumn('expert_profiles', 'consultationTypes');
    await queryInterface.removeColumn('expert_profiles', 'languages');
    await queryInterface.removeColumn('expert_profiles', 'hourlyRate');
    await queryInterface.removeColumn('expert_profiles', 'pricePerMinute');
    await queryInterface.removeColumn('expert_profiles', 'totalSessions');
  }
};
