//user must categorise it things
const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    user: {
      //refense to user (look who create that category)
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    name: {
      type: String,
      required: true,
      default: "Uncategorised",
    },
    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
    },
  },
  { timestamps: true }
);
const CategoryModel = mongoose.model(
  "CategoryModel",
  categorySchema,
  "categoryCollection"
);
module.exports = CategoryModel;
