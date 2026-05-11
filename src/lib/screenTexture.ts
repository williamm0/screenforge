import * as THREE from 'three';
import { computeImageFitRect, ImageFitMode } from './imageFit';

export const createScreenTexture = (imageUrl: string, targetRatio = 1, fit: ImageFitMode = 'cover') =>
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

      const rect = computeImageFitRect(image.width, image.height, width, height, fit);

      context.fillStyle = '#050505';
      context.fillRect(0, 0, width, height);
      context.drawImage(image, rect.x, rect.y, rect.width, rect.height);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      texture.needsUpdate = true;
      resolve(texture);
    };
    image.onerror = () => reject(new Error('Could not load uploaded image.'));
    image.src = imageUrl;
  });
