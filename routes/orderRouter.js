
const express = require("express");
const router = express.Router();
const orderController = require("../controller/order");

router.post("/create", orderController.createOrder);
router.get("/",orderController.getOrderById);
router.get("/users",  orderController.getOrdersByUser);
router.delete("/cancel", orderController.cancelOrder);
router.post("/checkout", orderController.checkout);

module.exports = router;
