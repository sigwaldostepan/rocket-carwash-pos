CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE IF NOT EXISTS "customer" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "code" VARCHAR(255),
    "name" VARCHAR(255),
    "phone_number" VARCHAR(255),
    "point" INTEGER,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "expense" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "description" VARCHAR(255),
    "amount" DECIMAL NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" UUID,

    CONSTRAINT "PK_edd925b450e13ea36197c9590fc" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "expense_category" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "description" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_478b68a9314d8787fb3763a2298" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "item" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR NOT NULL,
    "price" DECIMAL NOT NULL,
    "isRedeemable" BOOLEAN NOT NULL DEFAULT false,
    "isGetPoint" BOOLEAN NOT NULL DEFAULT false,
    "canBeComplimented" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "migrations" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "transaction" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "invoiceNo" VARCHAR NOT NULL,
    "paymentMethod" VARCHAR,
    "isCompliment" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" UUID,
    "complimentValue" DECIMAL NOT NULL DEFAULT 0,
    "transTotal" DECIMAL NOT NULL DEFAULT 0,
    "isNightShift" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "transaction_detail" ( 
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "transactionId" UUID,
    "itemId" UUID,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "redeemedQuantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PK_bafdd7fde2ed67494cf9cd9ec2a" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "email" VARCHAR(255),
    "password" VARCHAR(255),
    "createdAt" TIMESTAMP(6) DEFAULT '2025-05-28 03:58:48.521396'::timestamp without time zone,
    "updatedAt" TIMESTAMP(6) DEFAULT '2025-05-28 03:58:48.521396'::timestamp without time zone,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN

    -- 1. Expense -> Expense Category
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_42eea5debc63f4d1bf89881c10a') THEN
        ALTER TABLE "expense" ADD CONSTRAINT "FK_42eea5debc63f4d1bf89881c10a" FOREIGN KEY ("categoryId") REFERENCES "expense_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
    END IF;

    -- 2. Transaction -> Customer
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_16ead8467f1f71ac7232aa46ad3') THEN
        ALTER TABLE "transaction" ADD CONSTRAINT "FK_16ead8467f1f71ac7232aa46ad3" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    END IF;

    -- 3. Transaction Detail -> Transaction
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_46ace7094c8fa92dc33f82c9aa6') THEN
        ALTER TABLE "transaction_detail" ADD CONSTRAINT "FK_46ace7094c8fa92dc33f82c9aa6" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    END IF;

    -- 4. Transaction Detail -> Item
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_dc321d3ba426d32789f3d74aba6') THEN
        ALTER TABLE "transaction_detail" ADD CONSTRAINT "FK_dc321d3ba426d32789f3d74aba6" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
    END IF;

END $$;