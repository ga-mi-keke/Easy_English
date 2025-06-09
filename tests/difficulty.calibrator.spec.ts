import { DifficultyCalibrator } from '../src/content/difficulty.calibrator';

describe('DifficultyCalibrator', () => {
  it('calibrate(1200) returns a value between 100 and 1300', () => {
    const calibrator = new DifficultyCalibrator();
    const result = calibrator.calibrate(1200);
    expect(result).toBeGreaterThanOrEqual(100);
    expect(result).toBeLessThanOrEqual(1300);
  });
});
