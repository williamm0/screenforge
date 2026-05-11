import { Clipboard, Download, RotateCcw, Save } from 'lucide-react';
import { BACKGROUNDS, BackgroundId } from '../config/backgrounds';
import { DEVICE_CONFIGS, DeviceId } from '../config/devices';
import { ImageFitMode } from '../lib/imageFit';

export type AppSettings = {
  background: BackgroundId;
  backgroundColor: string;
  lighting: number;
  ambient: number;
  keyX: number;
  keyY: number;
  shadow: number;
  shadowSoftness: number;
  zoom: number;
  autoRotate: boolean;
  imageFit: ImageFitMode;
  screenBrightness: number;
};

type ControlPanelProps = {
  selectedDevice: DeviceId;
  settings: AppSettings;
  canExport: boolean;
  onDeviceChange: (device: DeviceId) => void;
  onSettingsChange: (settings: AppSettings) => void;
  onResetRotation: () => void;
  onExport: () => void;
  onSave: () => void;
  onCopy: () => void;
};

const updateSetting = <K extends keyof AppSettings>(
  settings: AppSettings,
  key: K,
  value: AppSettings[K],
) => ({
  ...settings,
  [key]: value,
});

export const ControlPanel = ({
  selectedDevice,
  settings,
  canExport,
  onDeviceChange,
  onSettingsChange,
  onResetRotation,
  onExport,
  onSave,
  onCopy,
}: ControlPanelProps) => (
  <aside className="control-panel" aria-label="Scene controls">
    <div className="panel-section">
      <p className="eyebrow">Choose a device</p>
      <select value={selectedDevice} onChange={(event) => onDeviceChange(event.target.value as DeviceId)}>
        {DEVICE_CONFIGS.map((device) => (
          <option key={device.id} value={device.id}>
            {device.displayName}
          </option>
        ))}
      </select>
    </div>

    <div className="panel-section">
      <p className="eyebrow">Background</p>
      <div className="background-grid">
        {BACKGROUNDS.map((background) => (
          <button
            className={`background-chip ${settings.background === background.id ? 'is-selected' : ''}`}
            key={background.id}
            type="button"
            onClick={() => onSettingsChange(updateSetting(settings, 'background', background.id))}
          >
            <span style={{ background: background.swatch }} />
            {background.label}
          </button>
        ))}
      </div>
      <label className="color-row">
        <span>Color</span>
        <input
          type="color"
          value={settings.backgroundColor}
          onChange={(event) => onSettingsChange(updateSetting(settings, 'backgroundColor', event.target.value))}
        />
      </label>
    </div>

    <div className="panel-section">
      <p className="eyebrow">Tune the scene</p>
      <Range label="Lighting" min={0.2} max={4} step={0.1} value={settings.lighting} onChange={(value) => onSettingsChange(updateSetting(settings, 'lighting', value))} />
      <Range label="Ambient" min={0} max={2} step={0.05} value={settings.ambient} onChange={(value) => onSettingsChange(updateSetting(settings, 'ambient', value))} />
      <Range label="Key light X" min={-6} max={6} step={0.2} value={settings.keyX} onChange={(value) => onSettingsChange(updateSetting(settings, 'keyX', value))} />
      <Range label="Key light Y" min={1} max={8} step={0.2} value={settings.keyY} onChange={(value) => onSettingsChange(updateSetting(settings, 'keyY', value))} />
      <Range label="Shadow" min={0} max={1} step={0.05} value={settings.shadow} onChange={(value) => onSettingsChange(updateSetting(settings, 'shadow', value))} />
      <Range label="Softness" min={1} max={12} step={0.5} value={settings.shadowSoftness} onChange={(value) => onSettingsChange(updateSetting(settings, 'shadowSoftness', value))} />
      <Range label="Camera zoom" min={0.7} max={1.45} step={0.05} value={settings.zoom} onChange={(value) => onSettingsChange(updateSetting(settings, 'zoom', value))} />
      <Range label="Screen glow" min={0} max={0.6} step={0.02} value={settings.screenBrightness} onChange={(value) => onSettingsChange(updateSetting(settings, 'screenBrightness', value))} />
      <div className="segmented-row" role="group" aria-label="Image fit">
        <button
          className={settings.imageFit === 'cover' ? 'is-selected' : ''}
          type="button"
          onClick={() => onSettingsChange(updateSetting(settings, 'imageFit', 'cover'))}
        >
          Cover
        </button>
        <button
          className={settings.imageFit === 'contain' ? 'is-selected' : ''}
          type="button"
          onClick={() => onSettingsChange(updateSetting(settings, 'imageFit', 'contain'))}
        >
          Contain
        </button>
      </div>
    </div>

    <div className="panel-actions">
      <label className="toggle-row">
        <input
          type="checkbox"
          checked={settings.autoRotate}
          onChange={(event) => onSettingsChange(updateSetting(settings, 'autoRotate', event.target.checked))}
        />
        <span>Auto-rotate</span>
      </label>
      <button className="utility-button" type="button" onClick={onResetRotation}>
        <RotateCcw size={16} />
        Reset
      </button>
      <button className="utility-button" type="button" onClick={onCopy} disabled={!canExport}>
        <Clipboard size={16} />
        Copy
      </button>
      <button className="utility-button" type="button" onClick={onSave} disabled={!canExport}>
        <Save size={16} />
        Save
      </button>
      <button className="primary-button" type="button" onClick={onExport} disabled={!canExport}>
        <Download size={16} />
        Export mockup
      </button>
    </div>
  </aside>
);

type RangeProps = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
};

const Range = ({ label, min, max, step, value, onChange }: RangeProps) => (
  <label className="range-row">
    <span>{label}</span>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    <output>{value.toFixed(step < 0.1 ? 2 : 1)}</output>
  </label>
);
