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
    return next(
      new AppError("Product already in favorites", httpStatusText.BadRequest)
    );
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

  res.status(201).json({ message: "Product added to favorites", favorite });
});

exports.getAllFavoriteProducts = asyncHandler(async (req, res, next) => {
  const firebaseId = + req.params.firebaseId;

  const favoriteProducts = await prisma.userFavorite.findMany({
    where: { firebaseId: firebaseId },
    select: {
      product: true,
    },
  });

  if (!favoriteProducts) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({ favoriteProducts });
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
      new AppError("Product not found in favorites", httpStatusText.NotFound)
    );
  }

  await prisma.userFavorite.delete({
    where: {
      id: existingFavorite.id, 
    },
  });

  res.status(200).json({ message: "Product removed from favorites" });
});



