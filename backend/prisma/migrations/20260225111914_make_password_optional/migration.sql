/*
  Warnings:

  - You are about to drop the column `createdAt` on the `LastLogin` table. All the data in the column will be lost.
  - Added the required column `lastLoginAt` to the `LastLogin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LastLogin" DROP COLUMN "createdAt",
ADD COLUMN     "lastLoginAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;
