import { describe, expect, it } from 'vitest';
import { computeImageFitRect } from './imageFit';

describe('computeImageFitRect', () => {
  it('crops wide images in cover mode', () => {
    expect(computeImageFitRect(2000, 1000, 1000, 1000, 'cover')).toEqual({
      x: -500,
      y: 0,
      width: 2000,
      height: 1000,
    });
  });

  it('letterboxes wide images in contain mode', () => {
    expect(computeImageFitRect(2000, 1000, 1000, 1000, 'contain')).toEqual({
      x: 0,
      y: 250,
      width: 1000,
      height: 500,
    });
  });
});
