import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { ImagePlus, Upload } from 'lucide-react';

type UploadDropzoneProps = {
  hasImage: boolean;
  onImageSelected: (file: File) => void;
};

const isSupportedImage = (file: File) => ['image/png', 'image/jpeg', 'image/webp'].includes(file.type);

export const UploadDropzone = ({ hasImage, onImageSelected }: UploadDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];

    if (file && isSupportedImage(file)) {
      onImageSelected(file);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    event.target.value = '';
  };

  return (
    <div
      className={`dropzone ${isDragging ? 'is-dragging' : ''} ${hasImage ? 'has-image' : ''}`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleChange} />
      <button className="dropzone-button" type="button" onClick={() => inputRef.current?.click()}>
        {hasImage ? <ImagePlus size={17} /> : <Upload size={17} />}
        {hasImage ? 'Replace image' : 'Drop a screenshot'}
      </button>
      {!hasImage ? (
        <div className="dropzone-copy">
          <strong>Drop an image to place it on a device.</strong>
          <span>Your image stays in your browser.</span>
        </div>
      ) : null}
    </div>
  );
};
