const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/verifyToken");
const cartController = require("../controller/cart");
const verifyToken = require("../middleware/verifyToken");

router.post("/add/", authMiddleware, cartController.addItemToCart);
router.delete(
  "/remove/:itemId",
  authMiddleware,
  cartController.removeItemFromCart
);
router.patch(
  "/update/:itemId",
  authMiddleware,
  cartController.updateItemQuantity
);
module.exports = router;
