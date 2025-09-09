import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../connection";

// 상담 요청 인터페이스
interface ConsultationRequestAttributes {
  id: number;
  clientId: number; // User 테이블과의 외래키 (상담을 요청하는 사용자)
  expertId: number; // Expert 테이블과의 외래키 (요청받는 전문가)
  clientName: string; // 클라이언트 이름
  clientEmail: string; // 클라이언트 이메일
  consultationType: 'video' | 'chat' | 'voice'; // 상담 유형
  preferredDate?: Date; // 희망 상담 날짜
  message?: string; // 상담 요청 메시지
  status: 'pending' | 'accepted' | 'rejected' | 'expired'; // 요청 상태
  expertMessage?: string; // 전문가 응답 메시지
  expiresAt?: Date; // 요청 만료 시간
  createdAt?: Date;
  updatedAt?: Date;
}

// 생성 시 필수 아닌 컬럼 정의
type ConsultationRequestCreationAttributes = Optional<
  ConsultationRequestAttributes,
  | "id"
  | "preferredDate"
  | "message"
  | "status"
  | "expertMessage"
  | "expiresAt"
  | "createdAt"
  | "updatedAt"
>;

export class ConsultationRequest
  extends Model<ConsultationRequestAttributes, ConsultationRequestCreationAttributes>
  implements ConsultationRequestAttributes
{
  public id!: number;
  public clientId!: number;
  public expertId!: number;
  public clientName!: string;
  public clientEmail!: string;
  public consultationType!: 'video' | 'chat' | 'voice';
  public preferredDate?: Date;
  public message?: string;
  public status!: 'pending' | 'accepted' | 'rejected' | 'expired';
  public expertMessage?: string;
  public expiresAt?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // 관계 속성들
  public client?: any; // User 관계 속성
  public expert?: any; // Expert 관계 속성
}

ConsultationRequest.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: '상담 요청 클라이언트 ID'
    },
    expertId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'experts',
        key: 'id'
      },
      comment: '상담 요청받는 전문가 ID'
    },
    clientName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '클라이언트 이름'
    },
    clientEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true
      },
      comment: '클라이언트 이메일'
    },
    consultationType: {
      type: DataTypes.ENUM('video', 'chat', 'voice'),
      allowNull: false,
      comment: '상담 유형'
    },
    preferredDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '희망 상담 날짜'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '상담 요청 메시지'
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'expired'),
      allowNull: false,
      defaultValue: 'pending',
      comment: '요청 상태'
    },
    expertMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '전문가 응답 메시지'
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '요청 만료 시간'
    },
  },
  {
    sequelize,
    tableName: "consultation_requests",
    modelName: "ConsultationRequest",
    timestamps: true,
    indexes: [
      {
        fields: ['clientId']
      },
      {
        fields: ['expertId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['createdAt']
      },
      {
        fields: ['expiresAt']
      },
      {
        fields: ['expertId', 'status'] // 전문가별 상태 조회 최적화
      }
    ]
  }
);

export default ConsultationRequest;
