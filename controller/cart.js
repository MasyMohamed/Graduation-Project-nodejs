const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");

exports.addItemToCart = asyncHandler(async (req, res) => {
  const { id, quantity } = req.body;

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
    where: { id: id },
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const cartItem = await prisma.cartItem.create({
    data: {
      quantity: quantity,
      product: { connect: { id: id } },
      cart: { connect: { cartId: cart.cartId } },
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






