import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Review, Book, User } from '../models/index.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Add or update a review
router.post(
  '/',
  auth,
  [
    body('bookId').isInt().withMessage('Valid book ID required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isString()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { bookId, rating, comment = '' } = req.body;
      const userId = req.user.id;

      // Check if book exists
      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      // Find or create review
      const [review, created] = await Review.findOrCreate({
        where: { bookId, userId },
        defaults: { rating, comment }
      });

      // If review already exists, update it
      if (!created) {
        await review.update({ rating, comment });
      }

      // Calculate new average rating for the book
      const allReviews = await Review.findAll({ where: { bookId } });
      const averageRating = allReviews.length > 0 
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

      // Update book's average rating
      await book.update({ averageRating: Math.round(averageRating * 10) / 10 });

      res.status(201).json(review);
    } catch (error) {
      console.error('Error creating/updating review:', error);
      res.status(500).json({ message: 'Server error creating review' });
    }
  }
);

// Get reviews for a specific book
router.get('/:bookId', async (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);
    
    const reviews = await Review.findAll({
      where: { bookId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
});

// Get user's reviews
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Check if user is requesting their own reviews
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const reviews = await Review.findAll({
      where: { userId },
      include: [{
        model: Book,
        as: 'book',
        attributes: ['id', 'title', 'author']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Server error fetching user reviews' });
  }
});

export default router;