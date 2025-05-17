// src/session/session.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface QuestionDto {
  id: string;
  questionEn: string;
  choices: string[];
}

export interface SessionDto {
  sessionId: string;
  content: {
    id: string;
    passage: string;
    audioUrl: string;
  };
  questions: QuestionDto[];
}

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  /** セッション開始：DBに session を作成し、Content＋Question を返す */
  async startSession(userId: string): Promise<SessionDto> {
    // 1) セッションレコード作成
    const session = await this.prisma.session.create({
      data: { userId },
    });

    // 2) 例として最新の Content を取得（難易度調整はあとで実装）
    const content = await this.prisma.content.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { questions: true },
    });
    if (!content) {
      throw new Error('No content available');
    }

    // 3) DTO 形式に組み立てて返却
    return {
      sessionId: session.id,
      content: {
        id: content.id,
        passage: content.passage,
        audioUrl: content.audioUrl,
      },
      questions: content.questions.map((q) => ({
        id: q.id,
        questionEn: q.questionEn,
        choices: [q.choice1, q.choice2, q.choice3, q.choice4],
      })),
    };
  }

  /** 回答登録用のメソッド例 */
  async submitAnswer(
    sessionId: string,
    questionId: string,
    choice: number,
  ): Promise<boolean> {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });
    const isCorrect = question?.correctChoice === choice;
    await this.prisma.answer.create({
      data: {
        sessionId,
        questionId,
        selectedChoice: choice,
        isCorrect: !!isCorrect,
      },
    });
    return !!isCorrect;
  }

  /** セッション終了／レーティング計算呼び出し例 */
  async finishSession(sessionId: string, userId: string) {
    // レーティング計算は RatingService に委譲
    // 例:
    // return this.ratingService.finalizeSession(sessionId, userId);
  }
}
