const httpStatus = require("../utils/httpStatusText");
const AppError = require("../utils/AppError");
const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const prisma = new PrismaClient();

exports.getAllProducts = asyncHandler(async (req, res) => {

  const products = await prisma.product.findMany();
  res.status(200).json({ status: httpStatus.Success, data: products });
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
  const {
    name,
    price,
    brand,
    categoryId,
    product_image_url,
    description,
    skin_type,
    stock_quantity,
  } = req.body;

  try {
    // Validate presence of categoryId
    if (!categoryId) {
      return res
        .status(400)
        .json({ status: "Error", message: "Missing category ID" });
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId }, // Assuming "id" is the primary key for Category
    });

    if (!existingCategory) {
      return res
        .status(400)
        .json({ status: "Error", message: "Invalid category ID" });
    }

    const productData = {
      name,
      price,
      brand,
      category: { connect: { id: categoryId } },
      product_image_url,
      description,
      skin_type,
      stock_quantity,
    };

    const product = await prisma.product.create({
      data: productData,
    });

    res.status(201).json({ status: "Success", data: product });
  } catch (error) {
    next(error);
  }
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
      return next(new AppError(404, "Product not found"));
    }

    res.status(200).json({ status: httpStatus.Success, data: product });
  });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {

  const productToDelete = await prisma.product.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!productToDelete) {
    return next(new AppError("Product not found", 404));
  }

  await prisma.product.delete({
    where: { id: parseInt(req.params.id) },
  });

  res.status(200).json({
    status: "Success",
    message: "Product deleted successfully",
  });
});

exports.searchProducts = asyncHandler(async (req, res, next) => {
  const { searchQuery } = req.params;

  if (!searchQuery) {
    return next(
      new AppError("Search query is required", httpStatus.BadRequest)
    );
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchQuery, mode: "insensitive" } },
        ],
      },
    });
    res.json({ status: "Success", data: products });
  } catch (error) {
    next(error);
  }
});
