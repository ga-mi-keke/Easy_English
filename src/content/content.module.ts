// src/content/content.module.ts
import { Module } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { DifficultyCalibrator } from "./difficulty.calibrator";
import { ContentService } from "./content.service";

@Module({
  providers: [PrismaService, DifficultyCalibrator, ContentService],
  exports: [ContentService],
})
export class ContentModule {}
