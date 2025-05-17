// src/answer/answer.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { RatingService } from "@/rating/rating.service";

@Injectable()
export class AnswerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ratingSvc: RatingService
  ) {}

  /** 1問ずつの回答を登録し、正誤を返す */
  async submitAnswer(
    userId: string,
    sessionId: string,
    questionId: string,
    choice: number
  ): Promise<{ correct: boolean }> {
    // Session 存在チェック
    await this.prisma.session.findUniqueOrThrow({ where: { id: sessionId } });

    // Question と正解取得
    const question = await this.prisma.question.findUniqueOrThrow({
      where: { id: questionId },
      select: { correctChoice: true },
    });

    const isCorrect = question.correctChoice === choice;

    // 回答登録
    await this.prisma.answer.create({
      data: {
        sessionId,
        questionId,
        selectedChoice: choice,
        isCorrect,
      },
    });

    return { correct: isCorrect };
  }

  /** セッション終了時に RatingService を呼び出し */
  async finalizeSession(
    userId: string,
    sessionId: string
  ): Promise<{ newRating: number; newLevel: number; delta: number }> {
    return this.ratingSvc.finalizeSession(sessionId, userId);
  }
}
