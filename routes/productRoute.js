const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} = require("../controller/product");
const {
  addProductToFavorites,
  getAllFavoriteProducts,
  removeProductFromFavorites,
  toggleFavoriteStatus
} = require("../controller/addToFav");
const { validateProduct } = require("../utils/validators/productValidator");

router.route("/").get(getAllProducts).post(createProduct);

router
  .route("/:id")
  .get(validateProduct, getProduct)
  .patch(validateProduct, updateProduct)
  .delete(deleteProduct);

router
  .route("/search/:searchQuery")
  .get(searchProducts);


router
  .route("/fav/add")
  .post(addProductToFavorites);

router
  .route("/fav/user/:firebaseId")
  .get(getAllFavoriteProducts);

router
  .route("/fav/remove")
  .post(removeProductFromFavorites);

router
  .route("/:productId/users/:firebaseId/toggleFavorite")
  .put(toggleFavoriteStatus);

module.exports = router;
