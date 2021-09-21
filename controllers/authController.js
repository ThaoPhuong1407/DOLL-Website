const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = catchAsync(async (user, statusCode, res) => {
  const token = await signToken(user._id);

  // SEND COOKIE
  // attach the cookie to the res object
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Remove password from the output, not db
  user.password = undefined;

  if (process.env.Node_ENV === "production") {
    cookieOptions.secure = false;
  }

  res.cookie("jwt", token, {
    cookieOptions,
  });

  res.status(statusCode).json({
    status: "success",
    token: token,
    data: { user },
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  // Create a token
  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password exist
  if (!email || !password) {
    // we need return so that we won't send responses multiple times
    return next(new AppError("Please provide email and password", 400));
  }

  // 2. Check if user exists && password is correct
  // because password was deslected, we need to use +password here to get the data
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401)); // 401 = unauthorized
  }

  // 3) If everything is ok, send token to client
  createAndSendToken(user, 201, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1. Getting token and check of it exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("You are not login, please login again.", 401)); //unauthorized
  }

  // 2. Verify token
  const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const currentUser = await User.findById(payload.id);
  if (!currentUser)
    return next(
      new AppError("The user belonging to this token no longer eixsts.", 401)
    );

  // 4. Check if user changed password after the JWT token was issued
  if (currentUser.changedPasswordAfterJWT(payload.iat)) {
    return next(
      new AppError(
        "The user recently changed password. Please login again",
        401
      )
    );
  }

  // If all conditions are passed, the user can only then proceed to the middleware.
  req.user = currentUser;
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError("There is no user with this email address.", 404));

  // 2) Generate the random reset token and save it to the databse
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // disable all validation requirements..

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: req.body.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }

  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on the Token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // 2) Set new password if token has NOT expired, and there is a valid user
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 400 = bad request
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // 3) Update changedPasswordAt
  // This step is done in userModel

  // 4) Log the user in, send JWT
  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  console.log(res.locals.user);
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is incorrect.", 401));
  }

  // 3) Update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  // We cannot use findByIdAndUpdate b/c all validations for and .pre middlewares don't apply
  await user.save(); // Only run validators on the fields that we want to update

  // 4) Log user in, send JWT
  createAndSendToken(user, 200, res);
});

// Check if the user is logged in or not
// Only for rendering pages. No errors created in this funciton
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const token = req.cookies.jwt;

      // 1) Verify token
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changes password after the token was issued
      if (currentUser.changedPasswordAfterJWT(decoded.iat)) {
        return next();
      }

      // If we get to this point, there is a LOGGED IN USER
      // All pug templates have access to the res.locals -- passing data to the template
      res.locals.user = currentUser;
      return next();
    } catch {
      return next();
    }
  }
  next();
});
