import { Injectable } from '@nestjs/common';

@Injectable()
export class LevelService {
  calcLevel(rating: number): number {
    // 例: 100 ごとに 1 レベル
    return Math.floor(rating / 100) + 1;
  }
}
