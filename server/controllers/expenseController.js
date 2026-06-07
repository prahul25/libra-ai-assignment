const Expense = require('../models/Expense');

const validCategories = [
  'Food', 'Transport', 'Shopping', 'Entertainment',
  'Bills', 'Healthcare', 'Education', 'Other',
];

const getExpenses = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Expense.countDocuments(query);

    res.json({
      expenses,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    if (amount === undefined || amount < 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    if (!description || !description.trim() || description.length > 200) {
      return res.status(400).json({ message: 'Description is required (max 200 chars)' });
    }

    const expense = await Expense.create({
      user: req.user._id,
      amount,
      category,
      description,
      date,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    const { amount, category, description, date } = req.body;

    if (amount !== undefined && amount < 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    if (description !== undefined && (!description.trim() || description.length > 200)) {
      return res.status(400).json({ message: 'Description is required (max 200 chars)' });
    }
console.log('Updating expense with data:', { amount, category, description, date });
    expense.amount = amount ?? expense.amount;
    expense.category = category ?? expense.category;
    expense.description = description ?? expense.description;
    expense.date = date ?? expense.date;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [totalExpenses, monthlyExpenses, recentTransactions] = await Promise.all([
      Expense.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Expense.aggregate([
        { $match: { user: req.user._id, date: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Expense.find({ user: req.user._id })
        .sort({ date: -1 })
        .limit(5)
        .lean(),
    ]);

    res.json({
      totalExpenses: totalExpenses[0] || { total: 0, count: 0 },
      monthlyExpenses: monthlyExpenses[0] || { total: 0, count: 0 },
      recentTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getDashboard,
};
