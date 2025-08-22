const express = require("express");
const userController = require("../controllers/UserAuth.controller");
const isAuthenticated = require("../middlewares/isAuth.middleware");

const UserRouter = express.Router();

UserRouter.post("/api/v1/users/register", userController.Register);
UserRouter.post("/api/v1/users/login", userController.Login);
UserRouter.get(
  "/api/v1/users/profile",
  isAuthenticated,
  userController.UserProfile
);
UserRouter.put(
  "/api/v1/users/change-password",
  isAuthenticated,
  userController.ChangePass
);
UserRouter.put(
  "/api/v1/users/update-profile",
  isAuthenticated,
  userController.updateUserProfile
);

module.exports = UserRouter;
