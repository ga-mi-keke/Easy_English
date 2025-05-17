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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
// src/session/session.controller.ts
// セッションの開始・終了を受け付ける API エンドポイント
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const rating_service_1 = require("../rating/rating.service");
let SessionController = class SessionController {
    constructor(prisma, ratingSvc) {
        this.prisma = prisma;
        this.ratingSvc = ratingSvc;
    }
    async start(userId) {
        // ① ユーザの現行レーティング取得
        const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
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
    async finish(sessionId, userId) {
        return this.ratingSvc.finalizeSession(sessionId, userId);
    }
};
exports.SessionController = SessionController;
__decorate([
    (0, common_1.Post)('start'),
    __param(0, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "start", null);
__decorate([
    (0, common_1.Post)('finish/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "finish", null);
exports.SessionController = SessionController = __decorate([
    (0, common_1.Controller)('session'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        rating_service_1.RatingService])
], SessionController);
