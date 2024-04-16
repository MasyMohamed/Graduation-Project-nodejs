-- CreateTable
CREATE TABLE "SavedCartItem" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SavedCartItem_pkey" PRIMARY KEY ("id")
);
