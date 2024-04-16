const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/AppError");

exports.addProductToFavorites = asyncHandler(async (req, res, next) => {
  const { id, userId, productId } = req.body;

  const existingFavorite = await prisma.userFavorite.findUnique({
    where: {
      id,
      userId, 
      productId, 
    },
  });

  if (existingFavorite) {
    return next(
      new AppError("Product already in favorites", httpStatusText.BadRequest)
    );
  }

  const favorite = await prisma.userFavorite.create({
    data: {
      user: {
        connect: { userId: userId },
      },
      product: {
        connect: { id: productId },
      },
    },
  });

  res.status(201).json({ message: "Product added to favorites", favorite });
});

exports.getAllFavoriteProducts = asyncHandler(async (req, res, next) => {
  const userId = + req.params.userId;

  const favoriteProducts = await prisma.userFavorite.findMany({
    where: { userId: userId },
    select: {
      product: true,
    },
  });

  if (!favoriteProducts) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({ favoriteProducts });
});
