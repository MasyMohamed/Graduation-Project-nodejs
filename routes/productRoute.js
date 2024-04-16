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
const verifyToken = require("../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");
const userRoles = require("../utils/userRoles");

router
  .route("/")
  .get(getAllProducts)
  .post(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.PRODUCT_MANAGER),
    createProduct
)

router
  .route("/:id")
  .get(validateProduct,getProduct)
  .patch(verifyToken, validateProduct, updateProduct)
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.PRODUCT_MANAGER),
    deleteProduct
  );

router.route('/fav').post(verifyToken,addProductToFavorites)
router.route("/fav/:userId").get(verifyToken,getAllFavoriteProducts);



module.exports = router;
