import * as THREE from 'three';
import { applyImageTransform, computeImageFitRect, ImageFitMode, ImageTransform } from './imageFit';

export const createScreenTexture = (
  imageUrl: string,
  targetRatio = 1,
  fit: ImageFitMode = 'cover',
  transform: ImageTransform = { scale: 1, offsetX: 0, offsetY: 0, rotation: 0 },
) =>
  new Promise<THREE.CanvasTexture>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const width = 2048;
      const height = Math.round(width / targetRatio);
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('Canvas 2D context is unavailable.'));
        return;
      }

      canvas.width = width;
      canvas.height = height;

      const rect = applyImageTransform(
        computeImageFitRect(image.width, image.height, width, height, fit),
        width,
        height,
        transform,
      );

      context.fillStyle = '#050505';
      context.fillRect(0, 0, width, height);
      context.save();
      context.translate(width / 2, height / 2);
      context.rotate(transform.rotation);
      context.drawImage(image, rect.x - width / 2, rect.y - height / 2, rect.width, rect.height);
      context.restore();

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      texture.needsUpdate = true;
      resolve(texture);
    };
    image.onerror = () => reject(new Error('Could not load uploaded image.'));
    image.src = imageUrl;
  });
