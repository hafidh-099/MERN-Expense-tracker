const bodyParser = require("body-parser");
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const UserRouter = require("./routes/User.route");
const errorHandler = require("./middlewares/ErroHandle.middleware");
const CategoryRouter = require("./routes/Category.route");
const TransactionRouter = require("./routes/Transaction.route");

const app = express();
app.use(bodyParser.json());

mongoose
  .connect(process.env.URL)
  .then(() => console.log("Success connection"))
  .catch((e) => console.log(e));

app.use("/", CategoryRouter);
app.use("/", UserRouter);
app.use("/api/v1/transaction",TransactionRouter)

app.use(errorHandler);
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
