import { describe, expect, it } from 'vitest';
import { DEVICE_CONFIGS, SCREEN_MESH_NAME_PATTERN } from './devices';

describe('device configuration', () => {
  it('maps every requested device to a model asset path', () => {
    expect(DEVICE_CONFIGS.length).toBeGreaterThan(9);

    for (const device of DEVICE_CONFIGS) {
      expect(device.modelPath).toMatch(/^models\/.+\.glb$/);
      expect(device.displayName).toBeTruthy();
      expect(device.fallbackScreen.size[0]).toBeGreaterThan(0);
      expect(device.fallbackScreen.size[1]).toBeGreaterThan(0);
    }
  });

  it('recognizes common screen mesh and material names', () => {
    const names = ['screen', 'Display', 'glass_panel', 'MonitorSurface', 'lcd_material'];

    for (const name of names) {
      expect(SCREEN_MESH_NAME_PATTERN.test(name)).toBe(true);
    }
  });
});
