const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler"); //this is used to handle error in json(bcs of that we dont need trycatch)
const userModel = require("../models/User.model");

//user registration
exports.Register = asyncHandler(async (req, res) => {
  //register
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new Error("Please all field are required");
  }
  const findUserbyEmail = await userModel.findOne({ email });
  if (findUserbyEmail) {
    throw new Error("user already exists");
  }
  const hashPass = bcrypt.hashSync(password, 10);
  //create user and save into db
  const userCreate = await userModel.create({
    username,
    password: hashPass,
    email,
  });
  res.json({
    username: userCreate.username,
    email: userCreate.email,
    id: userCreate._id,
  });
});
//login
exports.Login = asyncHandler(async (req, res) => {
  //get user data
  const { email, password } = req.body;
  const findUserbyEmail = await userModel.findOne({ email });
  if (!findUserbyEmail) {
    throw new Error("ivalid login");
  }
  const decryptPass = bcrypt.compareSync(password, findUserbyEmail.password);
  if (!decryptPass) {
    throw new Error("invalid login credential");
  }
  const token = jwt.sign({ id: findUserbyEmail._id }, "is Secret", {
    expiresIn: "10h",
  }); //30day
  res.json({
    message: "login success",
    token,
    id: findUserbyEmail._id,
    email: findUserbyEmail.email,
    username: findUserbyEmail.username,
  });
});
//limit user access
//profile
exports.UserProfile = asyncHandler(async (req, res) => {
  console.log(req.user);
  const user = await userModel.findOne({ _id: req.user });
  // console.log(user);
  if (!user) {
    throw new Error("user not found");
  }
  res.json({ username: user.username, email: user.email });
});

exports.ChangePass = asyncHandler(async (req, res) => {
  const { newPass } = req.body;
  const user = await userModel.findOne({ _id: req.user });
  // console.log(user);
  if (!user) {
    throw new Error("user not found");
  }
  const hashPass = bcrypt.hashSync(newPass, 10);
  user.password = hashPass;
  //resave
  await user.save();
  res.json({ message: "password change success" });
});
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  const update = await userModel.findByIdAndUpdate(
    { _id: req.user },
    { username, email },
    { new: true } //i.e we want to return updated record
  );
  res.json({ message: "update profile success", update });
});
