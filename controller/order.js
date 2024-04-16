const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/AppError");

exports.createOrder = asyncHandler(async (req, res, next) => {
  const { userId, addressId, paymentId, cartId } = req.body;

  const cart = await prisma.cart.findFirst({
    where: { cartId: cartId },
    include: { cartItems: { include: { product: true } } },
  });

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  let totalAmount = 0;
  for (const cartItem of cart.cartItems) {
    totalAmount += cartItem.product.price * cartItem.quantity;
  }

  const order = await prisma.order.create({
    data: {
      date: new Date(),
      totalAmount: totalAmount,
      status: "Pending",
      userId: userId,
      orderItems: {
        createMany: {
          data: cart.cartItems.map((cartItem) => ({
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            subtotal: cartItem.product.price * cartItem.quantity,
          })),
        },
      },
      paymentId: paymentId,
      addressId: addressId,
    },
  });

  await prisma.cartItem.deleteMany({ where: { cartId: cartId } });

  res.status(201).json({ message: "Order created successfully", order });
});

exports.getOrderById = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await prisma.order.findUnique({
    where: { orderId: parseInt(orderId) },
    include: {
      user: true,
      orderItems: true,
      payment: true,
      address: true,
      shipping: true,
    },
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({ order });
});

exports.getOrdersByUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: { userId: parseInt(userId) },
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const orders = await prisma.order.findMany({
    where: { userId: parseInt(userId) },
    include: {
      user: true,
      orderItems: true,
      payment: true,
      address: true,
      shipping: true,
    },
  });

  if (orders.length === 0) {
    return next(new AppError("User has not made any orders", 404));
  }

  res.status(200).json({ orders });
});

exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await prisma.order.findUnique({
    where: { orderId: parseInt(orderId) },
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  if (order.status !== "Pending") {
    return next(new AppError("Order cannot be cancelled", 400));
  }

  const cancelledOrder = await prisma.order.update({
    where: { orderId: parseInt(orderId) },
    data: { status: "Cancelled" },
    include: {
      user: true,
      orderItems: true,
      payment: true,
      address: true,
      shipping: true,
    },
  });

  res
    .status(200)
    .json({ message: "Order cancelled successfully", order: cancelledOrder });
});

exports.getOrderInvoice = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const order = await prisma.order.findUnique({
    where: { orderId: parseInt(id) },
    include: {
      user: true,
      orderItems: true,
      payment: true,
      address: true,
      shipping: true,
    },
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  const invoiceContent = `
    Order ID: ${order.orderId}
    Date: ${order.date}
    Total Amount: ${order.totalAmount}
    Status: ${order.status}
    User: ${order.user.name} (${order.user.email})
    Address: ${order.address.street}, ${order.address.city}, ${order.address.country}
    Payment Method: ${order.payment.method}
    Shipping Status: ${order.shipping.status}
  `;

  res.status(200).send(invoiceContent);
});

exports.trackOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const order = await prisma.order.findUnique({
    where: { orderId: parseInt(id) },
    include: { shipping: true },
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  const trackingInfo = order.shipping.map((shipment) => ({
    shipmentId: shipment.shippingId,
    status: shipment.status,
    shippingDate: shipment.shippingDate,
    estimateDate: shipment.estimateDate,
    actualDate: shipment.actualDate,
    deliveryPartner: shipment.deliveryPartnerId,
  }));

  res.status(200).json({ trackingInfo });
});

exports.reOrder = asyncHandler(async (req, res, next) => {
 const { orderId } = req.params;

  const order = await prisma.order.findUnique({
    where: { orderId: parseInt(orderId) },
    include: { orderItems: true },
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  const newOrder = await prisma.order.create({
    data: {
      date: new Date(),
      user: { connect: { userId: order.userId } },
      totalAmount: order.totalAmount,
      status: "Pending",
      paymentId: order.paymentId,
          address: { connect: { addressId: order.addressId } },
          orderItems: {
        createMany: {
          data: order.orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    },
    include: { orderItems: true },
  });

  res.status(201).json({ message: "Order reordered successfully", order: newOrder });
});

exports.addOrderItemToOrder = asyncHandler(async (req, res, next) => {
  const { orderId, id, quantity } = req.body;

  const order = await prisma.order.findUnique({
    where: { orderId },
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
    }
     const product = await prisma.product.findUnique({
       where: { id },
       select: { price: true },
     });

     if (!product) {
       return next(new AppError("Product not found", 404));
     }
  const subtotal = product.price * quantity;

  const orderItem = await prisma.orderItem.create({
    data: {
      order: { connect: { orderId } },
      product: { connect: { id } },
      quantity,
      subtotal,
    },
  });

  res
    .status(201)
    .json({ message: "Order item added to order successfully", orderItem });
});
exports.removeOrderItemFromOrder = asyncHandler(async (req, res, next) => {
  const { orderItemId } = req.params;

  // Check if the order item exists
  const orderItem = await prisma.orderItem.findUnique({
    where: { itemId: parseInt(orderItemId) },
  });

  if (!orderItem) {
    return next(new AppError("Order item not found", 404));
  }

  // Delete the order item
  await prisma.orderItem.delete({
    where: { itemId: parseInt(orderItemId) },
  });

  res.status(200).json({ message: "Order item removed from order successfully" });
});




