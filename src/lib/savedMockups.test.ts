import { describe, expect, it } from 'vitest';
import { createSavedMockup } from './savedMockups';

describe('createSavedMockup', () => {
  it('creates stable metadata around a saved png', () => {
    const record = createSavedMockup(
      {
        deviceId: 'iphone-17-pro',
        imageDataUrl: 'data:image/png;base64,abc',
        settings: {
          background: 'light',
          backgroundColor: '#ffffff',
          lighting: 1,
          ambient: 1,
          keyX: 1,
          keyY: 1,
          shadow: 0.4,
          shadowSoftness: 4,
          zoom: 1,
          autoRotate: false,
          imageFit: 'cover',
          screenBrightness: 0.18,
        },
      },
      new Date('2026-05-11T12:00:00.000Z'),
    );

    expect(record.id).toMatch(/^mockup-2026-05-11T12:00:00\.000Z-/);
    expect(record.createdAt).toBe('2026-05-11T12:00:00.000Z');
    expect(record.imageDataUrl).toBe('data:image/png;base64,abc');
  });
});
