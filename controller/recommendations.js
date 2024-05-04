
const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("express-async-handler");

const prisma = new PrismaClient();

const recommendProducts = asyncHandler(async (req, res) => {
  const { firebaseId, profileId } = req.params;
  const parsedProfileId = parseInt(profileId);

  const skinProfile = await prisma.skinProfile.findUnique({
    where: { profileId:parsedProfileId },
    include: { User: true, recommendations: true },
  });

  if (!skinProfile || skinProfile.firebaseId !== firebaseId) {
    return res.status(404).json({ error: "Skin profile not found or invalid" });
  }

  let recommendedProducts = [];
  switch (skinProfile.skinType) {
    case "Oily":
    case "Acne":
    case "Oily S":
      recommendedProducts = await prisma.product.findMany({
        where: { skin_type: { in: ["Oily", "Acne", "Oily S"] } },
      });
      break;
    case "Dry":
    case "Dry S":
      recommendedProducts = await prisma.product.findMany({
        where: { skin_type: { in: ["Dry", "Dry S"] } },
      });
      break;
    case "Normal":
    case "Normal S":
      recommendedProducts = await prisma.product.findMany({
        where: { skin_type: { in: ["Normal", "Normal S"] } },
      });
      break;
    case "Combinational":
    case "Combinational S":
      recommendedProducts = await prisma.product.findMany({
        where: { skin_type: { in: ["Combinational", "Combinational S"] } },
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
