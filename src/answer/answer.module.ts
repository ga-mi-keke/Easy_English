import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService }    from './answer.service';
import { PrismaModule }     from '../prisma/prisma.module';
import { RatingModule }     from '../rating/rating.module';

@Module({
  imports:    [PrismaModule, RatingModule],  // ← PrismaService と RatingService を取り込む
  controllers: [AnswerController],
  providers:   [AnswerService],
})
export class AnswerModule {}
