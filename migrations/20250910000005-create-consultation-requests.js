'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('consultation_requests', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      clientId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: '상담 요청 클라이언트 ID'
      },
      expertId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'experts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: '상담 요청받는 전문가 ID'
      },
      clientName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '클라이언트 이름'
      },
      clientEmail: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '클라이언트 이메일'
      },
      consultationType: {
        type: Sequelize.ENUM('video', 'chat', 'voice'),
        allowNull: false,
        comment: '상담 유형'
      },
      preferredDate: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: '희망 상담 날짜'
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '상담 요청 메시지'
      },
      status: {
        type: Sequelize.ENUM('pending', 'accepted', 'rejected', 'expired'),
        allowNull: false,
        defaultValue: 'pending',
        comment: '요청 상태'
      },
      expertMessage: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '전문가 응답 메시지'
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: '요청 만료 시간'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // 인덱스 생성
    await queryInterface.addIndex('consultation_requests', ['clientId'], {
      name: 'idx_consultation_requests_client_id'
    });
    
    await queryInterface.addIndex('consultation_requests', ['expertId'], {
      name: 'idx_consultation_requests_expert_id'
    });
    
    await queryInterface.addIndex('consultation_requests', ['status'], {
      name: 'idx_consultation_requests_status'
    });
    
    await queryInterface.addIndex('consultation_requests', ['createdAt'], {
      name: 'idx_consultation_requests_created_at'
    });
    
    await queryInterface.addIndex('consultation_requests', ['expiresAt'], {
      name: 'idx_consultation_requests_expires_at'
    });
    
    await queryInterface.addIndex('consultation_requests', ['expertId', 'status'], {
      name: 'idx_consultation_requests_expert_status'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('consultation_requests');
  }
};
