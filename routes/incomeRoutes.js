const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { addIncome, getAllIncome, deleteIncome, downloadIncomeExcel } = require("../controllers/incomeController");

router.post("/add", protect, addIncome);
router.get("/getAll", protect, getAllIncome);
router.delete("/:id", protect, deleteIncome);
router.get("/download-income-excel", protect, downloadIncomeExcel);

module.exports = router;
