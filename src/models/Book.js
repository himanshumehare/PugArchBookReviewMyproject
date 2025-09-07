import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  author: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ''
  },
  averageRating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
    defaultValue: 0.00
  }
}, {
  timestamps: true
});

export default Book;