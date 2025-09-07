import User from './User.js';
import Book from './Book.js';
import Review from './Review.js';
import sequelize from '../config/database.js';

// Define associations
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Book.hasMany(Review, { foreignKey: 'bookId', as: 'reviews' });
Review.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

export { User, Book, Review, sequelize };
