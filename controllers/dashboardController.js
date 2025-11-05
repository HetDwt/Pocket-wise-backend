const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");

// Dashboard Data
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    // Fetch total income
    const totalIncome = await Income.aggregate([{ $match: { userId: userObjectId } }, { $group: { _id: null, total: { $sum: "$amount" } } }]);

    // Fetch total expense
    const totalExpense = await Expense.aggregate([{ $match: { userId: userObjectId } }, { $group: { _id: null, total: { $sum: "$amount" } } }]);

    // Get income transactions in the last 60 Days
    const last60DaysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    // Get total income for last 60 days
    const incomeLast60Days = last60DaysIncomeTransactions.reduce((sum, txn) => sum + txn.amount, 0);

    // Get expense transactions in the last 60 Days
    const last60DaysExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    // Get total expense for last 60 days
    const expenseLast60Days = last60DaysExpenseTransactions.reduce((sum, txn) => sum + txn.amount, 0);

    // Fetch last 5 income transactions
    const incomeTxns = await Income.find({ userId }).sort({ date: -1 }).limit(5);
    const incomeTransactions = incomeTxns.map((txn) => ({
      ...txn.toObject(),
      type: "income",
    }));

    // Fetch last 5 expense transactions
    const expenseTxns = await Expense.find({ userId }).sort({ date: -1 }).limit(5);
    const expenseTransactions = expenseTxns.map((txn) => ({
      ...txn.toObject(),
      type: "expense",
    }));

    // Merge and sort by latest date
    const lastTransactions = [...incomeTransactions, ...expenseTransactions].sort((a, b) => b.date - a.date);

    // Final response
    res.json({
      totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },
      last60DaysExpense: {
        total: expenseLast60Days,
        transactions: last60DaysExpenseTransactions,
      },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while getting dashboard data",
      error: error.message,
    });
  }
};
