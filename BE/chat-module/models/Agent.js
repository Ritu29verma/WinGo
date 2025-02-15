import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const Agent = sequelize.define('Agent', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'Agent', 
});

export default Agent;
