const xlsx = require("xlsx");
const Expense = require("../models/Expense");

// Add expense
exports.addExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const { icon, category, amount, date } = req.body;

    //Validation:check for missing fields
    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newExpense = new Expense({ userId, icon, category, amount, date: new Date(date) });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "Error while adding expense", error: error.message });
  }
};

// Get all expense
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error while getting expenses", error: error.message });
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting expense", error: error.message });
  }
};

// Download excel
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    //Prepare data for xlsx
    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");
    xlsx.writeFile(wb, "expense_details.xlsx");
    res.download("expense_details.xlsx");
    res.status(200).json({ message: "Excel file downloaded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while downloading excel", error: error.message });
  }
};
