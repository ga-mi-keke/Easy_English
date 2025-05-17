import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports:  [PrismaModule],    // ← PrismaService を使うなら要インポート
  providers: [LevelService],
  exports:   [LevelService],    // ← 他モジュールで使うなら要エクスポート
})
export class LevelModule {}
