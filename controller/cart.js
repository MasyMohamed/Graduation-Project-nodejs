const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/AppError");

exports.addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!req.currentUser) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  let cart = await prisma.cart.findFirst({
    where: { userId: req.currentUser.userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: req.currentUser.userId },
    });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const cartItem = await prisma.cartItem.create({
    data: {
      quantity: quantity,
      productId: productId,
      cartId: cart.cartId,
    },
  });

  res.json(cartItem);
});

exports.removeItemFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  await prisma.cartItem.delete({
    where: { itemId: parseInt(itemId) },
  });
  res.json({ message: "Item removed from cart successfully" });
});

exports.updateItemQuantity = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  await prisma.cartItem.update({
    where: { itemId: parseInt(itemId) },
    data: { quantity: quantity },
  });
  res.json({ message: "Item quantity updated successfully" });
});

exports.viewCart = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;

  const cart = await prisma.cart.findFirst({
    where: {
      userId: parseInt(userId),
    },
    include: {
      user: true,
      cartItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  res.status(200).json({ cart });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;

  await prisma.cartItem.deleteMany({
    where: { cartId: parseInt(userId) },
  });

  await prisma.cart.delete({
    where: {
      userId: parseInt(userId),
      cartId,
      orderId
    },
  });

  res.status(200).json({ message: "Cart cleared successfully" });
});


exports.calculateTotalCost = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;

  const cart = await prisma.cart.findFirst({
    where: {
      userId: parseInt(userId),
    },
    include: {
      cartItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  let totalCost = 0;
  for (const cartItem of cart.cartItems) {
    totalCost += cartItem.product.price * cartItem.quantity;
  }

  res.status(200).json({ totalCost });
});

exports.saveCart = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;

  const cart = await prisma.cart.findFirst({
    where: {
      userId: parseInt(userId),
    },
    include: {
      cartItems: true,
    },
  });

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  const savedCartItems = await prisma.savedCartItem.createMany({
    data: cart.cartItems.map((cartItem) => ({
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      userId: parseInt(userId),
    })),
  });

  res.status(201).json({ message: "Cart saved successfully", savedCartItems });
});



