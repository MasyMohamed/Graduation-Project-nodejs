const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/AppError");

exports.addProductToFavorites = asyncHandler(async (req, res, next) => {
  const { firebaseId, productId } = req.body;

  const existingFavorite = await prisma.userFavorite.findFirst({
    where: {
      firebaseId,
      productId,
    },
  });

  if (existingFavorite) {
    return next(new AppError("Product already in favorites", 400));
  }

  const favorite = await prisma.userFavorite.create({
    data: {
      user: {
        connect: { firebaseId: firebaseId },
      },
      product: {
        connect: { id: productId },
      },
    },
  });

  res.status(201).json({
    status: "Success",
    message: "Product added to favorites",
    favorite,
  });
});

exports.getAllFavoriteProducts = asyncHandler(async (req, res, next) => {
  const firebaseId = req.params.firebaseId;

  const favoriteProducts = await prisma.userFavorite.findMany({
    where: { firebaseId: firebaseId },
    select: {
      product: true,
    },
  });

  if (!favoriteProducts || favoriteProducts.length === 0) {
    return next(new AppError("User has no favorite products", 404));
  }

  res.status(200).json({
    status: httpStatusText.Success,
    favoriteProducts
  });
});

exports.removeProductFromFavorites = asyncHandler(async (req, res, next) => {
  const { firebaseId, productId } = req.body;

  const existingFavorite = await prisma.userFavorite.findFirst({
    where: {
      user: {
        firebaseId: firebaseId,
      },
      productId: productId,
    },
  });

  if (!existingFavorite) {
    return next(
      new AppError("Product not found in favorites", 404)
    );
  }

  await prisma.userFavorite.delete({
    where: {
      id: existingFavorite.id,
    },
  });

  res.status(200).json({
    status: httpStatusText.Success,
    message: "Product removed from favorites"
  });
});
