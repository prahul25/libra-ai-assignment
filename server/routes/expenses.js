const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getDashboard,
} = require('../controllers/expenseController');

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
