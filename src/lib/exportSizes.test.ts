import { describe, expect, it } from 'vitest';
import { resolveExportDimensions } from './exportSizes';

describe('resolveExportDimensions', () => {
  it('keeps source canvas dimensions when requested', () => {
    expect(resolveExportDimensions('source', 1320, 900)).toEqual({ width: 1320, height: 900 });
  });

  it('supports export presets up to 8k', () => {
    expect(resolveExportDimensions('1080p', 1, 1)).toEqual({ width: 1920, height: 1080 });
    expect(resolveExportDimensions('8k', 1, 1)).toEqual({ width: 7680, height: 4320 });
  });
});
