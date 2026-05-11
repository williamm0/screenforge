export type ExportResolution = 'source' | '1080p' | '1440p' | '4k' | '5k' | '8k';

export type ExportDimensions = {
  width: number;
  height: number;
};

export const EXPORT_RESOLUTIONS: Array<{ id: ExportResolution; label: string }> = [
  { id: 'source', label: 'Canvas' },
  { id: '1080p', label: '1080p' },
  { id: '1440p', label: '1440p' },
  { id: '4k', label: '4K' },
  { id: '5k', label: '5K' },
  { id: '8k', label: '8K' },
];

const FIXED_RESOLUTIONS: Record<Exclude<ExportResolution, 'source'>, ExportDimensions> = {
  '1080p': { width: 1920, height: 1080 },
  '1440p': { width: 2560, height: 1440 },
  '4k': { width: 3840, height: 2160 },
  '5k': { width: 5120, height: 2880 },
  '8k': { width: 7680, height: 4320 },
};

export const resolveExportDimensions = (
  resolution: ExportResolution,
  sourceWidth: number,
  sourceHeight: number,
): ExportDimensions => {
  if (resolution === 'source') {
    return { width: sourceWidth, height: sourceHeight };
  }

  return FIXED_RESOLUTIONS[resolution];
};
