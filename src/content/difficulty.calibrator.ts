// src/content/difficulty.calibrator.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class DifficultyCalibrator {
  private readonly MARGIN = 100;

  /** rating ± MARGIN のランダム幅で出題難易度を決定 */
  calibrate(rating: number): number {
    const offset = (Math.random() * 2 - 1) * this.MARGIN;
    return Math.max(100, Math.round(rating + offset));
  }
}
