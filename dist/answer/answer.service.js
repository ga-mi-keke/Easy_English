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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerService = void 0;
// src/answer/answer.service.ts
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const rating_service_1 = require("../rating/rating.service");
let AnswerService = class AnswerService {
    constructor(prisma, ratingSvc) {
        this.prisma = prisma;
        this.ratingSvc = ratingSvc;
    }
    /** 1問ずつの回答を登録し、正誤を返す */
    async submitAnswer(userId, sessionId, questionId, choice) {
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
    async finalizeSession(userId, sessionId) {
        return this.ratingSvc.finalizeSession(sessionId, userId);
    }
};
exports.AnswerService = AnswerService;
exports.AnswerService = AnswerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        rating_service_1.RatingService])
], AnswerService);
