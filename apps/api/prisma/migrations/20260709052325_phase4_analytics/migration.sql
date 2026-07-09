-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('SALES_SUMMARY', 'ITEMS_PERFORMANCE', 'TRANSACTIONS');

-- CreateEnum
CREATE TYPE "ExportFileType" AS ENUM ('PDF', 'EXCEL');

-- CreateEnum
CREATE TYPE "ExportJobStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "AiInsightType" AS ENUM ('BEST_SELLING_MENU', 'BUSIEST_HOURS', 'RESTOCK_PREDICTION', 'DECLINING_PRODUCTS', 'SALES_SUMMARY', 'BUSINESS_IMPROVEMENT');

-- CreateEnum
CREATE TYPE "AiInsightSource" AS ENUM ('GEMINI', 'LOCAL');

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "requestBody" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_insights" (
    "id" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "type" "AiInsightType" NOT NULL,
    "source" "AiInsightSource" NOT NULL,
    "periodFrom" TIMESTAMP(3),
    "periodTo" TIMESTAMP(3),
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "requestedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_export_jobs" (
    "id" TEXT NOT NULL,
    "outletId" TEXT NOT NULL,
    "reportType" "ReportType" NOT NULL,
    "fileType" "ExportFileType" NOT NULL,
    "status" "ExportJobStatus" NOT NULL DEFAULT 'PENDING',
    "periodFrom" TIMESTAMP(3) NOT NULL,
    "periodTo" TIMESTAMP(3) NOT NULL,
    "fileUrl" TEXT,
    "failureReason" TEXT,
    "requestedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "report_export_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_outletId_createdAt_idx" ON "audit_logs"("outletId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "ai_insights_outletId_type_createdAt_idx" ON "ai_insights"("outletId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "report_export_jobs_outletId_createdAt_idx" ON "report_export_jobs"("outletId", "createdAt");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "outlets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_insights" ADD CONSTRAINT "ai_insights_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "outlets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_export_jobs" ADD CONSTRAINT "report_export_jobs_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "outlets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
