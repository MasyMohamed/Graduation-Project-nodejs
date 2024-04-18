const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/product");
const { addProductToFavorites,
  getAllFavoriteProducts
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



module.exports = router;
