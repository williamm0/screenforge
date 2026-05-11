import { Download, Trash2 } from 'lucide-react';
import { SavedMockup } from '../lib/savedMockups';

type SavedGalleryProps = {
  mockups: SavedMockup[];
  onDownload: (mockup: SavedMockup) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
};

export const SavedGallery = ({ mockups, onDownload, onDelete, onClear }: SavedGalleryProps) => (
  <section className="saved-gallery" aria-label="Saved pictures">
    <div className="saved-gallery-header">
      <div>
        <p className="eyebrow">Saved pictures</p>
        <h2>Local mockup library</h2>
      </div>
      <button className="utility-button" type="button" onClick={onClear} disabled={mockups.length === 0}>
        Clear
      </button>
    </div>

    {mockups.length === 0 ? (
      <p className="empty-library">Saved PNGs appear here and stay in this browser.</p>
    ) : (
      <div className="saved-grid">
        {mockups.map((mockup) => (
          <article className="saved-card" key={mockup.id}>
            <img src={mockup.imageDataUrl} alt={mockup.title} />
            <div>
              <strong>{mockup.title}</strong>
              <span>{new Date(mockup.createdAt).toLocaleString()}</span>
            </div>
            <div className="saved-actions">
              <button className="icon-button" type="button" onClick={() => onDownload(mockup)} aria-label={`Download ${mockup.title}`}>
                <Download size={16} />
              </button>
              <button className="icon-button" type="button" onClick={() => onDelete(mockup.id)} aria-label={`Delete ${mockup.title}`}>
                <Trash2 size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    )}
  </section>
);
