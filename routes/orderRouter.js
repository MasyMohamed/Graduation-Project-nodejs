
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/verifyToken");
const orderController = require("../controller/order");

router.post("/create", authMiddleware, orderController.createOrder);
router.get("/:orderId", authMiddleware, orderController.getOrderById);
router.get("/user/:userId", authMiddleware, orderController.getOrdersByUser);
router.put("/cancel/:orderId", authMiddleware, orderController.cancelOrder);
router.get("/:id/invoice", authMiddleware, orderController.getOrderInvoice);
router.get("/:id/track", authMiddleware, orderController.trackOrder);
router.post("/:orderId/reorder", authMiddleware, orderController.reOrder);
router.post(
  "/add-to-order",
  authMiddleware,
  orderController.addOrderItemToOrder
);
router.delete(
  "/delete-from-order/:orderItemId",
  orderController.removeOrderItemFromOrder
);

module.exports = router;
