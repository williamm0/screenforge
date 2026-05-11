export type ImageFitMode = 'cover' | 'contain';

export type DrawRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ImageTransform = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

export const computeImageFitRect = (
  imageWidth: number,
  imageHeight: number,
  targetWidth: number,
  targetHeight: number,
  fit: ImageFitMode,
): DrawRect => {
  const imageRatio = imageWidth / imageHeight;
  const targetRatio = targetWidth / targetHeight;
  const shouldFillWidth = fit === 'contain' ? imageRatio > targetRatio : imageRatio <= targetRatio;
  const width = shouldFillWidth ? targetWidth : targetHeight * imageRatio;
  const height = shouldFillWidth ? targetWidth / imageRatio : targetHeight;

  return {
    x: (targetWidth - width) / 2,
    y: (targetHeight - height) / 2,
    width,
    height,
  };
};

export const applyImageTransform = (
  rect: DrawRect,
  targetWidth: number,
  targetHeight: number,
  transform: ImageTransform,
): DrawRect => {
  const safeScale = Math.max(0.2, transform.scale);
  const width = rect.width * safeScale;
  const height = rect.height * safeScale;

  return {
    x: (targetWidth - width) / 2 + transform.offsetX * targetWidth,
    y: (targetHeight - height) / 2 + transform.offsetY * targetHeight,
    width,
    height,
  };
};
