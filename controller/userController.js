const { PrismaClient } = require("@prisma/client");
const AppError = require("../utils/AppError");
const httpStatus = require("../utils/httpStatusText");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const asyncHandler = require("express-async-handler");

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

  const oldUser = await prisma.user.findUnique({
    where: { firebaseId: firebaseId },
  });

  if (oldUser) {
    return next(new AppError("User already exists", 400));
  }

  const newUser = await prisma.user.create({
    data: {
      firebaseId: firebaseId,
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
    return next(new AppError("User not found", 404));
  }

  const user = await prisma.user.findUnique({
    where: { firebaseId: firebaseId },
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  return res.status(200).json({
    status: httpStatus.Success,
    message: "This user logins successfully",
  });
});

exports.createAddress = asyncHandler(async (req, res, next) => {
  const { firebaseId, address } = req.body;

  const user = await prisma.user.findUnique({
    where: { firebaseId: firebaseId },
  });

  if (!user) {
    return res.status(404).json({
      status: "Error",
      message: "User not found",
    });
  }

  const newAddress = await prisma.address.create({
    data: {
      address: address,
      firebaseId: firebaseId, // Ensure the userId field is set to the user's firebaseId
    },
  });

  res.status(201).json({
    status: "Success",
    message: "Address created successfully",
    address: newAddress,
  });
});

exports.createPhoneNumber = asyncHandler(async (req, res, next) => {
  const { firebaseId, phoneNumber } = req.body;

  const user = await prisma.user.findUnique({
    where: { firebaseId: firebaseId },
  });

  if (!user) {
    return res.status(404).json({
      status: "Error",
      message: "User not found",
    });
  }

  const updatedUser = await prisma.user.update({
    where: { firebaseId: firebaseId },
    data: {
      phoneNumber: phoneNumber,
    },
  });

  res.status(200).json({
    status: "Success",
    message: "Phone number updated successfully",
  });
});


