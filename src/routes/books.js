import { Router } from 'express';
import { Book, Review, User } from '../models/index.js';

const router = Router();

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error fetching books' });
  }
});

// Get book by ID with reviews
router.get('/:id', async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Get reviews with user information
    const reviews = await Review.findAll({
      where: { bookId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']]
    });

    // Calculate average rating
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    res.json({
      ...book.toJSON(),
      averageRating: Math.round(averageRating * 10) / 10,
      reviews
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Server error fetching book' });
  }
});

export default router;