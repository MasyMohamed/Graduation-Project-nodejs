const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/verifyToken");
const cartController = require("../controller/cart");

router.post("/add-item",authMiddleware, cartController.addItemToCart);
router.delete("/remove-item/:itemId",authMiddleware, cartController.removeItemFromCart);
router.put("/update-item/:itemId", authMiddleware ,cartController.updateItemQuantity);
router.get("/:userId",authMiddleware, cartController.viewCart);
router.delete("/clear/:userId",authMiddleware, cartController.clearCart);
router.get("/total-cost/:userId", authMiddleware, cartController.calculateTotalCost);
router.post("/save/:userId", authMiddleware, cartController.saveCart);

module.exports = router;
