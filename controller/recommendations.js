const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("express-async-handler");

const prisma = new PrismaClient();

const recommendProducts = asyncHandler(async (req, res) => {
  const { firebaseId } = req.params;

  const skinProfile = await prisma.skinProfile.findUnique({
    where: { firebaseId: firebaseId },
    include: { User: true, recommendations: true },
  });

  if (!skinProfile || skinProfile.firebaseId !== firebaseId) {
    return res.status(404).json({ error: "Skin profile not found or invalid" });
  }

  let recommendedProducts = [];
  switch (skinProfile.skinType.toLowerCase()) {
    case "oily":
    case "acne":
    case "oily s":
      recommendedProducts = await prisma.product.findMany({
        where: {
          skin_type: {
            in: ["Oily", "Acne", "Oily S"],
          },
        },
      });
      break;
    case "dry":
    case "dry s":
      recommendedProducts = await prisma.product.findMany({
        where: { skin_type: { in: ["Dry", "Dry S"] } },
      });
      break;
    case "normal":
    case "normal s":
      recommendedProducts = await prisma.product.findMany({
        where: { skin_type: { in: ["Normal", "Normal S"] } },
      });
      break;
    case "combination":
    case "Combinational s":
      recommendedProducts = await prisma.product.findMany({
        where: { skin_type: { in: ["combination", "Combinational S"] } },
      });
      break;
    default:
      return res
        .status(400)
        .json({ error: "Invalid skin type in the profile" });
  }

  return res.json(recommendedProducts);
});

module.exports = {
  recommendProducts,
};
