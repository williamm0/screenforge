import { describe, expect, it } from 'vitest';
import { applyImageTransform, computeImageFitRect } from './imageFit';

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

  it('scales and offsets the crop rectangle from the screen center', () => {
    const rect = computeImageFitRect(1000, 1000, 1000, 1000, 'cover');

    expect(applyImageTransform(rect, 1000, 1000, { scale: 1.5, offsetX: 0.1, offsetY: -0.2, rotation: 0 })).toEqual({
      x: -150,
      y: -450,
      width: 1500,
      height: 1500,
    });
  });

  it('allows very small image scale for precise placement', () => {
    const rect = computeImageFitRect(1000, 1000, 1000, 1000, 'cover');

    expect(applyImageTransform(rect, 1000, 1000, { scale: 0.05, offsetX: 0, offsetY: 0, rotation: 0 })).toEqual({
      x: 475,
      y: 475,
      width: 50,
      height: 50,
    });
  });
});
