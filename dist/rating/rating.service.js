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
exports.RatingService = void 0;
// src/rating/rating.service.ts
// ユーザーの正答率を受け取り Rating / Level を更新するサービス
const common_1 = require("@nestjs/common"); // DI 用デコレータ
const prisma_service_1 = require("../prisma/prisma.service");
// Prisma クライアントをラップしたサービス
const level_service_1 = require("../level/level.service"); // レベル計算ルールをまとめたサービス
let RatingService = class RatingService {
    constructor(prisma, levelSvc) {
        this.prisma = prisma;
        this.levelSvc = levelSvc;
        this.K = 20;
    }
    async finalizeSession(sessionId, userId) {
        var _a;
        // ① セッション取得（見つからなければ404）
        const session = await this.prisma.session.findUniqueOrThrow({
            where: { id: sessionId },
            include: { answers: true },
        });
        // ② ユーザ取得（見つからなければ404）
        const user = await this.prisma.user.findUniqueOrThrow({
            where: { id: userId },
        });
        const correct = session.answers.filter(a => a.isCorrect).length;
        const ratio = correct / session.answers.length;
        const expected = this.expectedScore(user.rating, (_a = session.difficulty) !== null && _a !== void 0 ? _a : user.rating);
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
                ? [this.prisma.levelLog.create({
                        data: { userId, oldLevel: user.level, newLevel },
                    })]
                : []),
        ]);
        return { newRating, newLevel, delta };
    }
    expectedScore(rating, difficulty) {
        return 1 / (1 + Math.pow(10, (difficulty - rating) / 400));
    }
};
exports.RatingService = RatingService;
exports.RatingService = RatingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        level_service_1.LevelService])
], RatingService);
