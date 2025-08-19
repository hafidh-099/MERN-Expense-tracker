//any transaction that made
const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
    },
    category: {
      type: String,
      required: true,
      default: "Uncategorized",
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    discription: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const transactionModel = mongoose.model(
  "TransactionModel",
  transactionSchema,
  "transactionCollection"
);
module.exports = transactionModel;
