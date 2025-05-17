// src/content/content.service.ts
import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { DifficultyCalibrator } from "./difficulty.calibrator";
import { GeneratedContent } from "./dto/generated-content.dto";
import OpenAI from "openai";

@Injectable()
export class ContentService {
  private readonly openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  constructor(
    private readonly prisma: PrismaService,
    private readonly diffCal: DifficultyCalibrator
  ) {}

  /** 新しいセッション用に英文＋設問を生成し、DBに保存して返す */
  async generateForUser(userId: string) {
    // 1) ユーザーと現在Rating取得
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    // 2) 出題難易度決定
    const difficulty = this.diffCal.calibrate(user.rating);

    // 3) GPT呼び出し（プロンプトは下記仕様を参照）
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `
        You are an English question generator…
        `.trim(),
      },
      {
        role: "user",
        content: `Generate for difficulty = ${difficulty}`,
      },
    ];
    const res = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
    });

    const cont = res.choices[0].message.content;
    if (cont === null) {
      throw new Error("OpenAI からコンテンツが返ってきませんでした");
    }
    const json = JSON.parse(cont) as GeneratedContent;

    // 4) DB登録
    const content = await this.prisma.content.create({
      data: {
        difficulty,
        passage: json.passage,
        audioUrl: await this.makeTTS(json.passage),
        questions: {
          create: json.questions.map((q) => ({
            questionEn: q.questionEn,
            choice1: q.choices[0],
            choice2: q.choices[1],
            choice3: q.choices[2],
            choice4: q.choices[3],
            correctChoice: q.correctChoice,
          })),
        },
      },
      include: { questions: true },
    });

    return content;
  }

  /** TTS生成の簡易例 */
  private async makeTTS(text: string): Promise<string> {
    // （実装例: Azure/Google/OpenAI TTS呼び出し→S3アップロード→URL返却）
    // ここでは仮に直接返す
    return `https://cdn.example.com/tts/${encodeURIComponent(text)}.mp3`;
  }
}
