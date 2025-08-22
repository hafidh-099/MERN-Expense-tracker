const express = require("express");
const isAuthenticated = require("../middlewares/isAuth.middleware");
const categoryController = require("../controllers/Category.controller");

const CategoryRouter = express.Router();

//add
CategoryRouter.post(
  "/api/v1/category/create",
  isAuthenticated,
  categoryController.CreateCategory
);
//list
CategoryRouter.get(
  "/api/v1/category/lists",
  isAuthenticated,
  categoryController.FetchCategory
);
//update
CategoryRouter.put(
  "/api/v1/category/update/:id",
  isAuthenticated,
  categoryController.UpdateCategory
);
CategoryRouter.delete(
  "/api/v1/category/delete/:id",
  isAuthenticated,
  categoryController.DeleteCategory
);

module.exports = CategoryRouter;
