"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DifficultyCalibrator = void 0;
// src/content/difficulty.calibrator.ts
const common_1 = require("@nestjs/common");
let DifficultyCalibrator = class DifficultyCalibrator {
    constructor() {
        this.MARGIN = 100;
    }
    /** rating ± MARGIN のランダム幅で出題難易度を決定 */
    calibrate(rating) {
        const offset = (Math.random() * 2 - 1) * this.MARGIN;
        return Math.max(100, Math.round(rating + offset));
    }
};
exports.DifficultyCalibrator = DifficultyCalibrator;
exports.DifficultyCalibrator = DifficultyCalibrator = __decorate([
    (0, common_1.Injectable)()
], DifficultyCalibrator);
