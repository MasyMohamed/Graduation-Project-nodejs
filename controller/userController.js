const { PrismaClient } = require("@prisma/client");
const AppError = require("../utils/AppError");
const httpStatus = require("../utils/httpStatusText");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");
const { generateJWT } = require("../utils/generateJWT");
const { data } = require("@tensorflow/tfjs");

const prisma = new PrismaClient();

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await prisma.user.findMany({
    select: {
      firebaseId: true,
    },
  });

  res.status(200).json({ status: httpStatus.Success, data: users });
});

exports.register = asyncHandler(async (req, res, next) => {
  validatorMiddleware(req, res, async (err) => {
    if (err) {
      return next(err);
    }
  });

  const { firebaseId } = req.body;

  const oldUser = await prisma.user.findUnique({ where: { firebaseId: firebaseId } });

  if (oldUser) {
    return res.status(400).json({
      httpCode: 400,
      message: "User already exists",
      data: null,
      error: {
        statusCode: 400,
      },
    });
  }

  const newUser = await prisma.user.create({
    data: {
      firebaseId:firebaseId
    },
  });


    return res.status(200).json({
      status: "Success",

      data: {
        firebaseId: firebaseId,
      },
    });
  });

exports.login = asyncHandler(async (req, res, next) => {
  const { firebaseId } = req.body;

  if (!firebaseId) {
    return next(
      new Error(
        "User Not found",
        400,
        httpStatus.BadRequest
      )
    );
  }

  const user = await prisma.user.findUnique({
    where: { firebaseId: firebaseId},
  });

  if (!user) {
    return next(new Error("User not found", 404, httpStatus.NotFound));
  } else {
    return res.status(200).json({
      status: httpStatus.Success,
      message: "This user logins successfully", 
    });
  }
});

