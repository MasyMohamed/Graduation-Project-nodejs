
const express = require("express");
const router = express.Router();
const orderController = require("../controller/order");

router.post("/create", orderController.createOrder);
router.get("/:orderId",orderController.getOrderById);
router.get("/user/:firebaseId",  orderController.getOrdersByUser);
router.put("/cancel/:orderId", orderController.cancelOrder);
router.get("/:id/invoice", orderController.getOrderInvoice);
router.get("/:id/track", orderController.trackOrder);
router.post("/:orderId/reorder", orderController.reOrder);
router.post(
  "/add-to-order",
  orderController.addOrderItemToOrder
);
router.delete(
  "/deleteOrder/:ItemId",
  orderController.removeOrderItemFromOrder
);

module.exports = router;
