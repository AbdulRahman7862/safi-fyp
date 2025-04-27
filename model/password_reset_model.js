import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const PasswordReset = sequelize.define('PasswordReset', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: "Invalid email format.",
      },
    },
  },
  otp: {
    type: DataTypes.STRING(6),
    allowNull: true,
  },
  otpExpiration: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'passwordReset',
  timestamps: true,
});

export default PasswordReset;
