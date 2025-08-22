const asyncHandler = require("express-async-handler"); //this is used to handle error in json(bcs of that we dont need trycatch)
const CategoryModel = require("../models/Category.model");
const TransactionModel = require("../models/Transaction.model");

exports.CreateCategory = asyncHandler(async (req, res) => {
  const { name, type } = req.body;
  if (!name || !type) {
    throw new Error("name or type required to create category");
  }
  const normalizeName = name.toLowerCase();
  //check if invalid type
  const validType = ["income", "expense"];
  if (!validType.includes(type.toLowerCase())) {
    throw new Error("invalid category type");
  }
  //check if category exist or not(also we make sure every category belong to targeted user)
  const existCategory = await CategoryModel.findOne({
    name: normalizeName, //check if category exist to...
    user: req.user, // that user
  });
  if (existCategory) {
    throw new Error(`category ${existCategory.name} already exists`);
  }
  const createCategory = await CategoryModel.create({
    name: normalizeName,
    user: req.user,
    type,
  });
  res.status(201).json({ createCategory });
});

//fetch and list
exports.FetchCategory = asyncHandler(async (req, res) => {
  const category = await CategoryModel.find({ user: req.user });
  res.status(200).json(category);
});

exports.UpdateCategory = asyncHandler(async (req, res) => {
  //updateCategory
  const categoryId = req.params.id;
  const { type, name } = req.body;
  const normalizeName = name.toLowerCase();
  const category = await CategoryModel.findById(categoryId);
  if (!category && !category.user.toString() === req.user.toString()) {
    throw new Error("category not found or user not authorizes");
  }
  const oldName = category.name;
  //update
  category.name = normalizeName;
  category.type = type;
  const updatedCategory = await category.save();
  //update afted transaction
  if (oldName !== updatedCategory.name) {
    //if name is not same it means user update category
    await CategoryModel.updateMany(
      { user: req.user, category: oldName },
      { $set: { category: updatedCategory.name } }
    );
  }
  res.json(updatedCategory);
});

exports.DeleteCategory = asyncHandler(async (req, res) => {
  //delete category
  const category = await CategoryModel.findById(req.params.id);
  if (category && category.user.toString() === req.user.toString()) {
    const defaultCategory = "uncategorized";
    //if user delete category we need to update that field to be uncategorized (this is to avoid undifined value into our dbs)
    await TransactionModel.updateMany(
      { user: req.user, category: category._id },
      { $set: { category: defaultCategory } }
    );
    //remove category now after update
    await CategoryModel.findByIdAndDelete(req.params.id);
    res.json({ message: "category success deleted" });
  }else{
    throw new Error("category not found or user not authorized");
  }
});
