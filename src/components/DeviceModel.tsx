import { useEffect, useMemo, useRef, useState } from 'react';
import { Center, useGLTF } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { USDZLoader } from 'three/examples/jsm/loaders/USDZLoader.js';
import { DeviceConfig, SCREEN_MESH_NAME_PATTERN } from '../config/devices';
import { ImageFitMode } from '../lib/imageFit';
import { createScreenTexture } from '../lib/screenTexture';

type DeviceModelProps = {
  device: DeviceConfig;
  imageUrl: string | null;
  autoRotate: boolean;
  imageFit: ImageFitMode;
  screenBrightness: number;
};

type LoadedModelProps = DeviceModelProps & {
  source: THREE.Object3D;
};

const isScreenCandidate = (object: THREE.Object3D, material?: THREE.Material | THREE.Material[]) => {
  const materialNames = Array.isArray(material)
    ? material.map((item) => item.name).join(' ')
    : material?.name ?? '';

  return SCREEN_MESH_NAME_PATTERN.test(`${object.name} ${materialNames}`);
};

const makeScreenMaterial = (texture: THREE.Texture, brightness: number) =>
  new THREE.MeshStandardMaterial({
    map: texture,
    emissive: new THREE.Color('#ffffff'),
    emissiveMap: texture,
    emissiveIntensity: brightness,
    metalness: 0,
    roughness: 0.28,
    toneMapped: false,
  });

const createRoundedScreenGeometry = (width: number, height: number, radius: number) => {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();

  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  return new THREE.ShapeGeometry(shape, 18);
};

const LoadedModel = ({ device, imageUrl, source, autoRotate, imageFit, screenBrightness }: LoadedModelProps) => {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const fallbackScreenRatio = device.fallbackScreen.size[0] / device.fallbackScreen.size[1];

  useEffect(() => {
    let active = true;

    if (!imageUrl) {
      setTexture(null);
      return;
    }

    createScreenTexture(imageUrl, fallbackScreenRatio, imageFit)
      .then((nextTexture) => {
        if (active) {
          setTexture(nextTexture);
        } else {
          nextTexture.dispose();
        }
      })
      .catch(() => {
        if (active) {
          setTexture(null);
        }
      });

    return () => {
      active = false;
    };
  }, [fallbackScreenRatio, imageFit, imageUrl]);

  const { model, hasScreenMesh, fitScale } = useMemo(() => {
    const clone = source.clone(true);
    let screenFound = false;

    clone.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;

        if (texture && isScreenCandidate(object, object.material)) {
          object.material = makeScreenMaterial(texture, screenBrightness);
          screenFound = true;
        }
      }
    });

    const bounds = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    bounds.getSize(size);
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    const targetSize = device.id.includes('macbook') ? 3.2 : 2.95;

    return { model: clone, hasScreenMesh: screenFound, fitScale: targetSize / maxDimension };
  }, [device.id, screenBrightness, source, texture]);

  const fallbackGeometry = useMemo(() => {
    const [width, height] = device.fallbackScreen.size;
    return createRoundedScreenGeometry(width, height, device.fallbackScreen.radius);
  }, [device.fallbackScreen]);

  useFrame((_, delta) => {
    if (autoRotate) {
      if (groupRef.current) {
        groupRef.current.rotation.y += delta * 0.24;
      }
    }
  });

  return (
    <group ref={groupRef} rotation={device.initialRotation} scale={device.scale}>
      <Center>
        <group scale={fitScale}>
          <primitive object={model} />
          {texture && !hasScreenMesh ? (
            <mesh
              geometry={fallbackGeometry}
              position={device.fallbackScreen.position}
              rotation={device.fallbackScreen.rotation}
              renderOrder={5}
            >
              <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
            </mesh>
          ) : null}
        </group>
      </Center>
    </group>
  );
};

const GlbDevice = (props: DeviceModelProps) => {
  const gltf = useGLTF(props.device.modelPath) as unknown as { scene: THREE.Object3D };

  return <LoadedModel {...props} source={gltf.scene} />;
};

const UsdzDevice = (props: DeviceModelProps) => {
  const group = useLoader(USDZLoader, props.device.modelPath);

  return <LoadedModel {...props} source={group} />;
};

export const DeviceModel = (props: DeviceModelProps) => {
  if (props.device.modelPath.endsWith('.usdz')) {
    return <UsdzDevice {...props} />;
  }

  return <GlbDevice {...props} />;
};
