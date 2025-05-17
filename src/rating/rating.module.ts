// src/rating/rating.module.ts
import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LevelModule }   from '../level/level.module';

@Module({
  imports:  [PrismaModule,LevelModule], 
  providers: [RatingService],
  exports:   [RatingService],   // ← ここを追加
})
export class RatingModule {}
