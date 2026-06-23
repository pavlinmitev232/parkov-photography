-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "nameBg" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "roleBg" TEXT NOT NULL,
    "roleEn" TEXT NOT NULL,
    "quoteBg" TEXT NOT NULL,
    "quoteEn" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqItem" (
    "id" TEXT NOT NULL,
    "questionBg" TEXT NOT NULL,
    "questionEn" TEXT NOT NULL,
    "answerBg" TEXT NOT NULL,
    "answerEn" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FaqItem_pkey" PRIMARY KEY ("id")
);
