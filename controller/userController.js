const { PrismaClient } = require("@prisma/client");
const AppError = require("../utils/AppError");
const httpStatus = require("../utils/httpStatusText");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const emailValidator = require("../utils/validators/emailValidator");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");
const { generateJWT } = require("../utils/generateJWT");

const prisma = new PrismaClient();

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 20;
  const skip = (page - 1) * limit;

  const users = await prisma.user.findMany({
    skip,
    take: limit,
    select: {
      userId: true,
      first_name: true,
      last_name: true,
      email: true,
      role: true,
    },
  });

  res.status(200).json({ status: httpStatus.Success, page, data: users });
});

exports.register = asyncHandler(async (req, res, next) => {
  validatorMiddleware(req, res, async (err) => {
    if (err) {
      return next(err);
    }
  });

  const { first_name, last_name, email, password, role } = req.body;

  const oldUser = await prisma.user.findUnique({ where: { email: email } });

  if (oldUser) {
    return res.status(400).json({
      httpCode: 400,
      message: "User with this email already exists",
      data: null,
      error: {
        statusCode: 400,
      },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  if (!emailValidator.validateEmail(email)) {
    return res
      .status(400)
      .json({ status: "Error", message: "Invalid email format" });
  }

  const newUser = await prisma.user.create({
    data: {
      first_name: first_name,
      last_name: last_name,
      email,
      password: hashedPassword,
      role: role ? role.trim() : "USER",
      avatar: req.file.filename,
    },
  });

  const token = await generateJWT({
    email: newUser.email,
    id: newUser.id,
    role: newUser.role,
  });
  newUser.token = token;

  return res.status(200).json({
    status: "Success",
    data: { user: { ...newUser, role: newUser.role } },
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new Error("Email and password are required!", 400, httpStatus.BadRequest)
    );
  }

  const user = await prisma.user.findUnique({ where: { email: email } });

  if (!user) {
    return next(new Error("User not found", 404, httpStatus.NotFound));
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (matchedPassword) {
    const token = await generateJWT({
      email: user.email,
      id: user._id,
      role: user.role,
    }); 
    return res.status(200).json({ status: "Success", data: { token } });
  } else {
    return next(
      new Error("Email or password is wrong", 400, httpStatus.BadRequest)
    );
  }
});
