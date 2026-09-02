-- CreateTable
CREATE TABLE "draft" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "customerId" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "draft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draft_detail" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "draftId" UUID,
    "itemId" UUID,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "redeemedQuantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "draft_detail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "draft" ADD CONSTRAINT "draft_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "draft_detail" ADD CONSTRAINT "draft_detail_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "draft"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "draft_detail" ADD CONSTRAINT "draft_detail_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
