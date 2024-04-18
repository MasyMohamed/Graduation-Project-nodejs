const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category");
const { validateProduct } = require("../utils/validators/productValidator");
const allowedTo = require("../middleware/allowedTo");
const userRoles = require("../utils/userRoles");

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory);

router
  .route("/:id")
  .get(categoryController.getCategoryById)
  .patch( validateProduct, categoryController.updateCategory)
  .delete(
    categoryController.deleteCategory
  );

router
  .route("/:id/products")
  .post(categoryController.addProductToCategory);



module.exports = router;
