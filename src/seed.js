import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { Book, User } from './models/index.js';

dotenv.config();

const sampleBooks = [
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    description: 'A Handbook of Agile Software Craftsmanship. This book is about writing clean, readable, and maintainable code.',
    averageRating: 4.5
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andy Hunt & Dave Thomas',
    description: 'Your Journey to Mastery. Learn practical techniques for becoming a more effective programmer.',
    averageRating: 4.3
  },
  {
    title: 'Design Patterns',
    author: 'Gang of Four (GoF)',
    description: 'Elements of Reusable Object-Oriented Software. Classic patterns for object-oriented design.',
    averageRating: 4.1
  },
  {
    title: 'JavaScript: The Good Parts',
    author: 'Douglas Crockford',
    description: 'A guide to the good parts of JavaScript, showing how to write beautiful, effective code.',
    averageRating: 4.2
  },
  {
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    description: 'A Modern Introduction to Programming. Learn JavaScript through practical examples and exercises.',
    averageRating: 4.0
  }
];

const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123'
  },
  {
    name: 'Bob Wilson',
    email: 'bob@example.com',
    password: 'password123'
  }
];

async function seedDatabase() {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await Book.destroy({ where: {} });
    await User.destroy({ where: {} });
    console.log('🗑️  Cleared existing data');
    
    // Create sample users
    const users = await User.bulkCreate(sampleUsers);
    console.log(`👥 Created ${users.length} users`);
    
    // Create sample books
    const books = await Book.bulkCreate(sampleBooks);
    console.log(`📚 Created ${books.length} books`);
    
    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Sample users created:');
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - password: password123`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();