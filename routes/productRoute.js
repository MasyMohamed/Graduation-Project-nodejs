const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");
const { validateProduct } = require("../utils/validators/productValidator");
const verifyToken = require("../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");
const userRoles = require("../utils/userRoles");
router.route("/").get(getAllProducts).post(verifyToken,createProduct);

router
  .route("/:id")
  .get(getProduct)
  .patch(verifyToken,validateProduct, updateProduct)
  .delete(verifyToken,
    allowedTo(userRoles.ADMIN,userRoles.PRODUCT_MANAGER)
    ,deleteProduct);

module.exports = router;
