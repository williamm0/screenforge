import { Suspense, useEffect, useMemo, useRef } from 'react';
import type { ElementRef } from 'react';
import { ContactShadows, Environment, Html, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { BackgroundId } from '../config/backgrounds';
import { DeviceConfig } from '../config/devices';
import { ImageFitMode } from '../lib/imageFit';
import { DeviceModel } from './DeviceModel';

type SceneSettings = {
  background: BackgroundId;
  backgroundColor: string;
  lighting: number;
  keyLightColor: string;
  fillLightColor: string;
  ambient: number;
  keyX: number;
  keyY: number;
  shadow: number;
  shadowSoftness: number;
  zoom: number;
  autoRotate: boolean;
  imageFit: ImageFitMode;
  screenBrightness: number;
  imageScale: number;
  imageOffsetX: number;
  imageOffsetY: number;
  imageRotation: number;
  modelX: number;
  modelY: number;
  modelZ: number;
  modelRotationX: number;
  modelRotationY: number;
  modelRotationZ: number;
  modelScale: number;
  gradientStart: string;
  gradientEnd: string;
  gradientMid: string;
};

type DeviceSceneProps = {
  device: DeviceConfig;
  imageUrl: string | null;
  settings: SceneSettings;
  resetToken: number;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
};

const getSceneBackground = (settings: SceneSettings) => {
  if (settings.background === 'transparent') return null;
  if (settings.background === 'dark') return new THREE.Color('#272729');
  if (settings.background === 'warm') return new THREE.Color('#efe5d8');
  if (settings.background === 'cool') return new THREE.Color('#e7edf4');
  if (settings.background === 'light') return new THREE.Color(settings.backgroundColor);
  return null;
};

const StudioBackground = ({ settings }: { settings: SceneSettings }) => {
  const { scene } = useThree();
  const gradientTexture = useMemo(() => {
    const texture = new THREE.CanvasTexture(makeGradientCanvas(settings.gradientStart, settings.gradientMid, settings.gradientEnd));
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [settings.gradientEnd, settings.gradientMid, settings.gradientStart]);

  useEffect(() => {
    scene.background = getSceneBackground(settings);
  }, [scene, settings]);

  if (settings.background === 'gradient') {
    return (
      <mesh position={[0, 0, -3.2]} scale={[10, 6, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={gradientTexture} />
      </mesh>
    );
  }

  return null;
};

const makeGradientCanvas = (start: string, mid: string, end: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const context = canvas.getContext('2d');

  if (context) {
    const gradient = context.createLinearGradient(0, 0, 16, 16);
    gradient.addColorStop(0, start);
    gradient.addColorStop(0.55, mid);
    gradient.addColorStop(1, end);
    context.fillStyle = gradient;
    context.fillRect(0, 0, 16, 16);
  }

  return canvas;
};

const CameraRig = ({ device, zoom, resetToken }: { device: DeviceConfig; zoom: number; resetToken: number }) => {
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);

  useEffect(() => {
    controlsRef.current?.reset();
  }, [resetToken, device.id]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.35, device.cameraDistance / zoom]} fov={38} />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={2.4}
        maxDistance={8}
        minPolarAngle={0.55}
        maxPolarAngle={2.15}
        dampingFactor={0.08}
        enableDamping
      />
    </>
  );
};

export const DeviceScene = ({ device, imageUrl, settings, resetToken, onCanvasReady }: DeviceSceneProps) => (
  <Canvas
    shadows
    dpr={[1, 2]}
    gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}
    onCreated={({ gl }) => {
      gl.outputColorSpace = THREE.SRGBColorSpace;
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.05;
      onCanvasReady(gl.domElement);
    }}
  >
    <CameraRig device={device} zoom={settings.zoom} resetToken={resetToken} />
    <StudioBackground settings={settings} />
    <ambientLight intensity={settings.ambient} />
    <directionalLight
      castShadow
      position={[settings.keyX, settings.keyY, 4.5]}
      intensity={settings.lighting}
      color={settings.keyLightColor}
      shadow-mapSize={[2048, 2048]}
      shadow-bias={-0.00008}
    />
    <pointLight position={[-3.5, 1.6, 3]} intensity={settings.lighting * 0.38} color={settings.fillLightColor} />
    <Suspense
      fallback={
        <Html center>
          <div className="scene-loader" aria-label="Loading 3D model">
            <span />
          </div>
        </Html>
      }
    >
      <DeviceModel
        device={device}
        imageUrl={imageUrl}
        autoRotate={settings.autoRotate}
        imageFit={settings.imageFit}
        screenBrightness={settings.screenBrightness}
        imageScale={settings.imageScale}
        imageOffsetX={settings.imageOffsetX}
        imageOffsetY={settings.imageOffsetY}
        imageRotation={settings.imageRotation}
        modelX={settings.modelX}
        modelY={settings.modelY}
        modelZ={settings.modelZ}
        modelRotationX={settings.modelRotationX}
        modelRotationY={settings.modelRotationY}
        modelRotationZ={settings.modelRotationZ}
        modelScale={settings.modelScale}
      />
      <Environment preset="studio" environmentIntensity={0.38} />
    </Suspense>
    {settings.background !== 'transparent' ? (
      <ContactShadows
        position={[0, -1.35, 0]}
        opacity={settings.shadow}
        blur={settings.shadowSoftness}
        scale={5}
        far={4}
        resolution={1024}
      />
    ) : null}
  </Canvas>
);
