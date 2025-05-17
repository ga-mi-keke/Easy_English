"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentService = void 0;
// src/content/content.service.ts
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const difficulty_calibrator_1 = require("./difficulty.calibrator");
const openai_1 = __importDefault(require("openai"));
let ContentService = class ContentService {
    constructor(prisma, diffCal) {
        this.prisma = prisma;
        this.diffCal = diffCal;
        this.openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
    }
    /** 新しいセッション用に英文＋設問を生成し、DBに保存して返す */
    async generateForUser(userId) {
        // 1) ユーザーと現在Rating取得
        const user = await this.prisma.user.findUniqueOrThrow({
            where: { id: userId },
        });
        // 2) 出題難易度決定
        const difficulty = this.diffCal.calibrate(user.rating);
        // 3) GPT呼び出し（プロンプトは下記仕様を参照）
        const messages = [
            {
                role: 'system',
                content: `
        You are an English question generator…
        `.trim(),
            },
            {
                role: 'user',
                content: `Generate for difficulty = ${difficulty}`,
            },
        ];
        const res = await this.openai.chat.completions.create({
            model: 'gpt-4o',
            messages,
            temperature: 0.7,
        });
        const cont = res.choices[0].message.content;
        if (cont === null) {
            throw new Error('OpenAI からコンテンツが返ってきませんでした');
        }
        const json = JSON.parse(cont);
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
    async makeTTS(text) {
        // （実装例: Azure/Google/OpenAI TTS呼び出し→S3アップロード→URL返却）
        // ここでは仮に直接返す
        return `https://cdn.example.com/tts/${encodeURIComponent(text)}.mp3`;
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        difficulty_calibrator_1.DifficultyCalibrator])
], ContentService);
