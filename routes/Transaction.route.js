const express = require("express");
const isAuthenticated = require("../middlewares/isAuth.middleware");
const TransactionContoller = require("../controllers/Transaction.controller");


const TransactionRouter = express.Router();

//add
TransactionRouter.post(
  "/create",
  isAuthenticated,
  TransactionContoller.CreateTransaction
);
//list
TransactionRouter.get(
  "/lists",
  isAuthenticated,
  TransactionContoller.FetchTransaction
);
//filter
TransactionRouter.get(
  "/filter",
  isAuthenticated,
  TransactionContoller.FilterTransaction
);
TransactionRouter.put(
  "/update/:id",
  isAuthenticated,
  TransactionContoller.UpdateTransaction
);
TransactionRouter.delete(
  "/delete/:id",
  isAuthenticated,
  TransactionContoller.DeleteTransaction
);
module.exports = TransactionRouter;
