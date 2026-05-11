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
          keyLightColor: '#ffffff',
          fillLightColor: '#ffffff',
          ambient: 1,
          keyX: 1,
          keyY: 1,
          shadow: 0.4,
          shadowSoftness: 4,
          zoom: 1,
          autoRotate: false,
          imageFit: 'cover',
          screenBrightness: 0.18,
          imageScale: 1,
          imageOffsetX: 0,
          imageOffsetY: 0,
          imageRotation: 0,
          modelX: 0,
          modelY: 0,
          modelZ: 0,
          modelRotationX: 0,
          modelRotationY: 0,
          modelRotationZ: 0,
          modelScale: 1,
          gradientStart: '#ffffff',
          gradientMid: '#f5f5f7',
          gradientEnd: '#dfe7f3',
          exportResolution: 'source',
        },
      },
      new Date('2026-05-11T12:00:00.000Z'),
    );

    expect(record.id).toMatch(/^mockup-2026-05-11T12:00:00\.000Z-/);
    expect(record.createdAt).toBe('2026-05-11T12:00:00.000Z');
    expect(record.imageDataUrl).toBe('data:image/png;base64,abc');
  });
});
