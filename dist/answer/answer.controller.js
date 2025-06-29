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
exports.AnswerController = void 0;
// src/answer/answer.controller.ts
const common_1 = require("@nestjs/common");
const answer_service_1 = require("./answer.service");
let AnswerController = class AnswerController {
    constructor(answerSvc) {
        this.answerSvc = answerSvc;
    }
    async submit(userId, sessionId, questionId, choice) {
        return this.answerSvc.submitAnswer(userId, sessionId, questionId, choice);
    }
};
exports.AnswerController = AnswerController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)('userId')),
    __param(1, (0, common_1.Body)('sessionId')),
    __param(2, (0, common_1.Body)('questionId')),
    __param(3, (0, common_1.Body)('choice')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number]),
    __metadata("design:returntype", Promise)
], AnswerController.prototype, "submit", null);
exports.AnswerController = AnswerController = __decorate([
    (0, common_1.Controller)('answer'),
    __metadata("design:paramtypes", [answer_service_1.AnswerService])
], AnswerController);
