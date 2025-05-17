// src/session/session.controller.ts
// セッションの開始・終了を受け付ける API エンドポイント
import { Controller, Post, Body, Param } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { RatingService } from "@/rating/rating.service";
import { SessionService }          from './session.service';

@Controller("session")
export class SessionController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ratingSvc: RatingService
  ) {}

  @Post("start")
  async start(@Body("userId") userId: string) {
    // ① ユーザの現行レーティング取得
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    // ② 難易度レンジ内の Content を取得
    const content = await this.prisma.content.findFirstOrThrow({
      where: {
        difficulty: { gte: user.rating - 100, lte: user.rating + 100 },
      },
    });

    // ③ セッション生成時に difficulty をセット
    const session = await this.prisma.session.create({
      data: {
        userId,
        difficulty: content.difficulty,
      },
    });

    const questions = await this.prisma.question.findMany({
      where: { contentId: content.id },
    });

    return {
      sessionId: session.id,
      content,
      questions,
    };
  }
  @Post("finish/:sessionId")
  async finish(
    @Param("sessionId") sessionId: string,
    @Body("userId") userId: string
  ) {
    return this.ratingSvc.finalizeSession(sessionId, userId);
  }
}
