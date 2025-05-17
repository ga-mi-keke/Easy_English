// src/answer/answer.module.ts
import { Module } from '@nestjs/common';
import { AnswerController } from './answer/answer.controller';
import { AnswerService }    from './answer/answer.service';
import { PrismaModule }     from './prisma/prisma.module';
import { RatingModule }    from './rating/rating.module';
import { LevelModule }  from './level/level.module';
import { AnswerModule } from './answer/answer.module'
import { ContentModule }from './content/content.module';
import { SessionModule }   from './session/session.module';
@Module({
    imports:  [
        PrismaModule,
        LevelModule,
        ContentModule,
        AnswerModule,
        SessionModule,
        RatingModule
    ],
  controllers: [AnswerController],
  providers:   [AnswerService],
})
export class AppModule {}
