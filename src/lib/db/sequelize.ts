import { Sequelize } from "sequelize";

const {
  DB_HOST = "127.0.0.1",
  DB_PORT = "3306",
  DB_USER = "root",
  DB_PASS = "",
  DB_NAME = "consulton",
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: "mysql",
  timezone: "+09:00",
  dialectOptions: { dateStrings: true },
  logging: process.env.NODE_ENV === "development" ? console.log : false,
});

// 선택: 연결 확인용
export async function assertDbConnection() {
  await sequelize.authenticate();
}
