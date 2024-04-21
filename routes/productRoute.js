const express = require("express");
const router = express.Router();
const {
  getProducts,
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/product");
const { addProductToFavorites,
  getAllFavoriteProducts,
  removeProductFromFavorites
} = require("../controller/addToFav");
const { validateProduct } = require("../utils/validators/productValidator");

router
  .route("/")
  .get(getAllProducts)
  .post(
    createProduct
)

router
  .route("/:id")
  .get(validateProduct,getProduct)
  .patch( validateProduct, updateProduct)
  .delete(
    deleteProduct
  );

router.route('/fav').post(addProductToFavorites)
router.route("/fav/:userId").get(getAllFavoriteProducts);
router.route("/fav/remove").post(removeProductFromFavorites);


module.exports = router;
