export type DeviceId =
  | 'iphone-15-pro'
  | 'iphone-16-pro-max'
  | 'iphone-17-pro'
  | 'macbook-neo'
  | 'macbook-pro-14-inch-m5'
  | 'silver-apple-ipad-13-pro-m4';

export type FallbackScreen = {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  radius: number;
};

export type DeviceConfig = {
  id: DeviceId;
  displayName: string;
  modelPath: string;
  initialRotation: [number, number, number];
  scale: number;
  fallbackScreen: FallbackScreen;
  cameraDistance: number;
};

export const SCREEN_MESH_NAME_PATTERN = /(screen|display|glass|monitor|lcd)/i;

export const DEVICE_CONFIGS: DeviceConfig[] = [
  {
    id: 'iphone-15-pro',
    displayName: 'iPhone 15 Pro',
    modelPath: 'models/iphone-15-pro.glb',
    initialRotation: [0.12, -0.28, 0],
    scale: 1,
    cameraDistance: 4.8,
    fallbackScreen: { position: [0, 0, 0.07], rotation: [0, 0, 0], size: [1.05, 2.32], radius: 0.12 },
  },
  {
    id: 'iphone-16-pro-max',
    displayName: 'iPhone 16 Pro Max',
    modelPath: 'models/iphone-16-pro-max.glb',
    initialRotation: [0.08, -0.24, 0],
    scale: 1,
    cameraDistance: 4.9,
    fallbackScreen: { position: [0, 0, 0.07], rotation: [0, 0, 0], size: [1.12, 2.5], radius: 0.13 },
  },
  {
    id: 'iphone-17-pro',
    displayName: 'iPhone 17 Pro',
    modelPath: 'models/iphone-17-pro.glb',
    initialRotation: [0.1, -0.3, 0],
    scale: 1,
    cameraDistance: 4.8,
    fallbackScreen: { position: [0, 0, 0.07], rotation: [0, 0, 0], size: [1.1, 2.42], radius: 0.13 },
  },
  {
    id: 'macbook-neo',
    displayName: 'MacBook Neo',
    modelPath: 'models/macbook-neo.glb',
    initialRotation: [0.18, -0.45, 0],
    scale: 1,
    cameraDistance: 6,
    fallbackScreen: { position: [0, 0.7, -0.62], rotation: [-0.18, 0, 0], size: [3.1, 1.95], radius: 0.04 },
  },
  {
    id: 'macbook-pro-14-inch-m5',
    displayName: 'MacBook Pro 14-inch M5',
    modelPath: 'models/macbook-pro-14-inch-m5.glb',
    initialRotation: [0.18, -0.43, 0],
    scale: 1,
    cameraDistance: 6.2,
    fallbackScreen: { position: [0, 0.72, -0.62], rotation: [-0.18, 0, 0], size: [3.08, 1.92], radius: 0.04 },
  },
  {
    id: 'silver-apple-ipad-13-pro-m4',
    displayName: 'Silver iPad Pro 13-inch M4',
    modelPath: 'models/silver-apple-ipad-13-pro-m4.glb',
    initialRotation: [0.08, -0.22, 0],
    scale: 1,
    cameraDistance: 5,
    fallbackScreen: { position: [0, 0, 0.06], rotation: [0, 0, 0], size: [1.86, 2.56], radius: 0.08 },
  },
];

export const getDeviceConfig = (id: DeviceId) => {
  const config = DEVICE_CONFIGS.find((device) => device.id === id);

  if (!config) {
    throw new Error(`Unknown device id: ${id}`);
  }

  return config;
};
