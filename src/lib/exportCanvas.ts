import { ExportDimensions } from './exportSizes';

const renderCanvasToDataUrl = (canvas: HTMLCanvasElement, dimensions?: ExportDimensions) => {
  if (!dimensions || (dimensions.width === canvas.width && dimensions.height === canvas.height)) {
    return canvas.toDataURL('image/png');
  }

  const output = document.createElement('canvas');
  output.width = dimensions.width;
  output.height = dimensions.height;

  const context = output.getContext('2d');
  if (!context) {
    return canvas.toDataURL('image/png');
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(canvas, 0, 0, output.width, output.height);

  return output.toDataURL('image/png');
};

export const exportCanvasAsPng = (
  canvas: HTMLCanvasElement,
  filename = 'screenforge-mockup.png',
  dimensions?: ExportDimensions,
) => {
  const link = document.createElement('a');
  link.href = renderCanvasToDataUrl(canvas, dimensions);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const canvasToPngBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Could not render canvas as a PNG.'));
      }
    }, 'image/png');
  });

export const canvasToPngDataUrl = (canvas: HTMLCanvasElement) => canvas.toDataURL('image/png');

export const downloadDataUrl = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
};
