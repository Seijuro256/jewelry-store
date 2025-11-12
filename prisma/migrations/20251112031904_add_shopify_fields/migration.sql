/*
  Warnings:

  - A unique constraint covering the columns `[handle]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `handle` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "handle" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "type" TEXT,
ADD COLUMN     "vendor" TEXT NOT NULL DEFAULT 'Yeah Noir Yeah';

-- CreateIndex
CREATE UNIQUE INDEX "Product_handle_key" ON "Product"("handle");
