const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category");
const { validateProduct } = require("../utils/validators/productValidator");
const verifyToken = require("../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");
const userRoles = require("../utils/userRoles");

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory);

router
  .route("/:id")
  .get(categoryController.getCategoryById)
  .patch(verifyToken, validateProduct, categoryController.updateCategory)
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.PRODUCT_MANAGER),
    categoryController.deleteCategory
  );

router
  .route("/:id/products")
  .post(categoryController.addProductToCategory);



module.exports = router;
