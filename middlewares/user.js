const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utility/customError");
const jwt = require("jsonwebtoken");

// exports.isLoggedIn = BigPromise(async (req, res, next) => {
//   const token =
//     req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

//   // console.log("token", req.cookies);

//   if (!token) {
//     return next(new CustomError("Please login to get access", 401));
//   }

//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   // console.log("decoded", decoded);

//   req.user = await User.findById(decoded.id);

//   next();
// });

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    console.log("token", token);
    return next(new CustomError("Please login to get access", 401));
  }

  console.log("token", token);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();
});
