// src/session/session.module.ts
import { Module }              from '@nestjs/common';
import { SessionController }   from './session.controller';
import { SessionService }      from './session.service';
import { PrismaModule }        from '../prisma/prisma.module';
import { RatingModule }       from '../rating/rating.module'; 

@Module({
  imports:    [
    PrismaModule,
    RatingModule
],       // PrismaService が必要ならここに
  controllers: [SessionController],
  providers:   [SessionService],
  exports:     [SessionService],    // 外部で使うならエクスポート
})
export class SessionModule {}
