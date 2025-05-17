// src/rating/rating.service.ts
// ユーザーの正答率を受け取り Rating / Level を更新するサービス
import { Injectable } from "@nestjs/common"; // DI 用デコレータ
import { PrismaService } from "../prisma/prisma.service";
// Prisma クライアントをラップしたサービス
import { LevelService } from "../level/level.service"; // レベル計算ルールをまとめたサービス
import { Session, User } from "@prisma/client"; // 型補完を効かせたい場合に便利

@Injectable()
export class RatingService {
  private readonly K = 20;

  constructor(
    private readonly prisma: PrismaService,
    private readonly levelSvc: LevelService
  ) {}

  async finalizeSession(sessionId: string, userId: string) {
    // ① セッション取得（見つからなければ404）
    const session = await this.prisma.session.findUniqueOrThrow({
      where: { id: sessionId },
      include: { answers: true },
    });

    // ② ユーザ取得（見つからなければ404）
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const correct = session.answers.filter((a) => a.isCorrect).length;
    const ratio = correct / session.answers.length;

    const expected = this.expectedScore(
      user.rating,
      session.difficulty ?? user.rating
    );
    const delta = Math.round(this.K * (ratio - expected));
    const newRating = Math.max(0, user.rating + delta);
    const newLevel = this.levelSvc.calcLevel(newRating);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { rating: newRating, level: newLevel },
      }),
      this.prisma.ratingLog.create({
        data: {
          userId,
          oldRating: user.rating,
          newRating,
          delta,
        },
      }),
      ...(newLevel !== user.level
        ? [
            this.prisma.levelLog.create({
              data: { userId, oldLevel: user.level, newLevel },
            }),
          ]
        : []),
    ]);

    return { newRating, newLevel, delta };
  }

  private expectedScore(rating: number, difficulty: number): number {
    return 1 / (1 + Math.pow(10, (difficulty - rating) / 400));
  }
}
