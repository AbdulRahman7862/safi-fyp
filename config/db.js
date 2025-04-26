import dotenv from "dotenv"
import path from "path"
import { DataTypes, Sequelize } from "sequelize"
import { fileURLToPath } from "url"

const _filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(_filename)
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
})
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "mysql",
    port: process.env.DB_PORT || 3306,
    logging: process.env.DB_LOGGING === "true" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
)

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log(
      `Database connected: ${process.env.DB_NAME} at ${process.env.DB_HOST}:${process.env.DB_PORT}`
    )
  } catch (error) {
    console.error("Database connection failed:", error.message)
    process.exit(1)
  }
}


export { DataTypes, connectDB, sequelize }

