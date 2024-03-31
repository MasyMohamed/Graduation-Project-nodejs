const httpStatus = require("../utils/httpStatusText");
const AppError = require("../utils/AppError");
const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const prisma = new PrismaClient();

exports.getAllProducts = asyncHandler(async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  const products = await prisma.product.findMany({
    skip,
    take: limit,
  });
  res.status(200).json({ status: httpStatus.Success, page, data: products });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const productId = parseInt(id);

  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
        return next(new AppError("Product not found", 404));
  }
  res.status(200).json({ status: httpStatus.Success, data: product });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  validatorMiddleware(req, res, async (err) => {
    if (err) {
      return next(err); 
    } else {
      const existingProduct = await prisma.product.findUnique({
        where: { id: req.body.id },
      });

      if (existingProduct) {
        
        return next(new Error("Product with this ID already exists"));
      }

      // Create the product with the provided ID
      const product = await prisma.product.create({
        data: req.body,
      });

      res.status(201).json({ status: httpStatus.Success, data: { product } });
    }
  });
});


exports.updateProduct = asyncHandler(async (req, res, next) => {
  validatorMiddleware(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    const productId = parseInt(req.params.id);
    const updatedProductData = req.body; 

    const product = await prisma.product.update({
      where: { id: productId },
      data: updatedProductData,
    });

    if (!product) {
      return next(new AppError(404,"Product not found"));
    }

    res.status(200).json({ status: httpStatus.Success, data: product });
  });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const productId = parseInt(req.params.id);

  const productToDelete = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!productToDelete) {
    return next(new AppError("Product not found", 404));
  }

  const deletedProduct = await prisma.product.delete({
    where: { id: productId },
  });

  res.status(200).json({
    status: "Success",
    message: "Product deleted successfully",
  });
});
