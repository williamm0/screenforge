import { useEffect, useMemo, useState } from 'react';
import { Download, Save } from 'lucide-react';
import { ControlPanel, AppSettings } from './components/ControlPanel';
import { DeviceScene } from './components/DeviceScene';
import { Footer } from './components/Footer';
import { SavedGallery } from './components/SavedGallery';
import { UploadDropzone } from './components/UploadDropzone';
import { DeviceId, getDeviceConfig } from './config/devices';
import { canvasToPngBlob, canvasToPngDataUrl, downloadDataUrl, exportCanvasAsPng } from './lib/exportCanvas';
import { resolveExportDimensions } from './lib/exportSizes';
import { createSavedMockup, deleteSavedMockup, getSavedMockups, SavedMockup, saveMockup, clearSavedMockups } from './lib/savedMockups';

const DEFAULT_SETTINGS: AppSettings = {
  background: 'light',
  backgroundColor: '#f5f5f7',
  lighting: 2.1,
  keyLightColor: '#ffffff',
  fillLightColor: '#d8e9ff',
  ambient: 0.72,
  keyX: 2.4,
  keyY: 4.8,
  shadow: 0.34,
  shadowSoftness: 6,
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
};

export const App = () => {
  const [selectedDevice, setSelectedDevice] = useState<DeviceId>('iphone-17-pro');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [resetToken, setResetToken] = useState(0);
  const [savedMockups, setSavedMockups] = useState<SavedMockup[]>([]);
  const [statusMessage, setStatusMessage] = useState('Your image stays in your browser.');

  const device = useMemo(() => getDeviceConfig(selectedDevice), [selectedDevice]);

  const refreshSavedMockups = async () => {
    setSavedMockups(await getSavedMockups());
  };

  useEffect(() => {
    refreshSavedMockups().catch(() => setStatusMessage('Saved library is unavailable in this browser.'));
  }, []);

  const handleImageSelected = (file: File) => {
    setImageUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
  };

  const handleExport = () => {
    if (canvas) {
      exportCanvasAsPng(
        canvas,
        `screenforge-mockup-${settings.exportResolution}.png`,
        resolveExportDimensions(settings.exportResolution, canvas.width, canvas.height),
      );
    }
  };

  const handleSave = async () => {
    if (!canvas) return;

    const record = createSavedMockup({
      deviceId: selectedDevice,
      settings,
      imageDataUrl: canvasToPngDataUrl(canvas),
    });
    await saveMockup(record);
    await refreshSavedMockups();
    setStatusMessage('Saved to this browser.');
  };

  const handleCopy = async () => {
    if (!canvas || !navigator.clipboard || typeof ClipboardItem === 'undefined') {
      setStatusMessage('Clipboard PNG copy is not available in this browser.');
      return;
    }

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': await canvasToPngBlob(canvas),
      }),
    ]);
    setStatusMessage('Copied PNG to clipboard.');
  };

  const handleDownloadSaved = (mockup: SavedMockup) => {
    downloadDataUrl(mockup.imageDataUrl, `${mockup.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`);
  };

  const handleDeleteSaved = async (id: string) => {
    await deleteSavedMockup(id);
    await refreshSavedMockups();
  };

  const handleClearSaved = async () => {
    await clearSavedMockups();
    await refreshSavedMockups();
  };

  return (
    <div className="app-shell">
      <nav className="top-nav">
        <div>
          <span className="logo">Screenforge</span>
          <span className="tagline">device mockups in seconds</span>
        </div>
        <button className="primary-button nav-export" type="button" onClick={handleExport} disabled={!canvas}>
          <Download size={15} />
          Export
        </button>
      </nav>

      <main className="main-surface">
        <section className="intro">
          <p>Drop a screenshot</p>
          <h1>Pick a device, tune the studio, export a clean mockup.</h1>
          <div className="development-note">
            Screenforge is still in development and may not work as expected on every browser or device model.
          </div>
        </section>

        <section className="tool-grid">
          <div className="preview-panel">
            <DeviceScene
              device={device}
              imageUrl={imageUrl}
              settings={settings}
              resetToken={resetToken}
              onCanvasReady={setCanvas}
            />
            <div className="status-pill">{statusMessage}</div>
            <UploadDropzone hasImage={Boolean(imageUrl)} onImageSelected={handleImageSelected} />
          </div>

          <ControlPanel
            selectedDevice={selectedDevice}
            settings={settings}
            canExport={Boolean(canvas)}
            onDeviceChange={setSelectedDevice}
            onSettingsChange={setSettings}
            onResetRotation={() => setResetToken((token) => token + 1)}
            onExport={handleExport}
            onSave={handleSave}
            onCopy={handleCopy}
          />
        </section>

        <section className="quick-tools" aria-label="Quick tools">
          <button className="primary-button" type="button" onClick={handleSave} disabled={!canvas}>
            <Save size={16} />
            Save picture
          </button>
          <button className="utility-button" type="button" onClick={handleCopy} disabled={!canvas}>
            Copy PNG
          </button>
          <button className="utility-button" type="button" onClick={() => setSettings(DEFAULT_SETTINGS)}>
            Reset studio
          </button>
        </section>

        <SavedGallery
          mockups={savedMockups}
          onDownload={handleDownloadSaved}
          onDelete={handleDeleteSaved}
          onClear={handleClearSaved}
        />
      </main>

      <Footer />
    </div>
  );
};
