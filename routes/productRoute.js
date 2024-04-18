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
const allowedTo = require("../middleware/allowedTo");
const userRoles = require("../utils/userRoles");

router
  .route("/")
  .get(getAllProducts)
  .post(
    allowedTo(userRoles.ADMIN, userRoles.PRODUCT_MANAGER),
    createProduct
)

router
  .route("/:id")
  .get(validateProduct,getProduct)
  .patch( validateProduct, updateProduct)
  .delete(
    allowedTo(userRoles.ADMIN, userRoles.PRODUCT_MANAGER),
    deleteProduct
  );

router.route('/fav').post(addProductToFavorites)
router.route("/fav/:userId").get(getAllFavoriteProducts);



module.exports = router;
