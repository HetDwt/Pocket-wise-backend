const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { addExpense, getAllExpense, deleteExpense, downloadExpenseExcel } = require("../controllers/expenseController.js");

router.post("/add", protect, addExpense);
router.get("/getAll", protect, getAllExpense);
router.delete("/:id", protect, deleteExpense);
router.get("/download-expense-excel", protect, downloadExpenseExcel);

module.exports = router;
