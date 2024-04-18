const express = require("express");
const router = express.Router();
const cartController = require("../controller/cart");

router.post("/add-item", cartController.addItemToCart);
router.delete("/remove-item/:itemId", cartController.removeItemFromCart);
router.put("/update-item/:itemId" ,cartController.updateItemQuantity);
router.get("/:userId", cartController.viewCart);
router.delete("/clear/:userId", cartController.clearCart);
router.get("/total-cost/:userId", cartController.calculateTotalCost);
router.post("/save/:userId", cartController.saveCart);

module.exports = router;
