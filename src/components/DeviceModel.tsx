import { useEffect, useMemo, useRef, useState } from 'react';
import { Center, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DeviceConfig, SCREEN_MESH_NAME_PATTERN } from '../config/devices';
import { publicAssetUrl } from '../lib/assets';
import { ImageFitMode } from '../lib/imageFit';
import { createScreenTexture } from '../lib/screenTexture';

type DeviceModelProps = {
  device: DeviceConfig;
  imageUrl: string | null;
  autoRotate: boolean;
  imageFit: ImageFitMode;
  screenBrightness: number;
  imageScale: number;
  imageOffsetX: number;
  imageOffsetY: number;
  modelX: number;
  modelY: number;
  modelZ: number;
  modelRotationX: number;
  modelRotationY: number;
  modelRotationZ: number;
  modelScale: number;
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

const LoadedModel = ({
  device,
  imageUrl,
  source,
  autoRotate,
  imageFit,
  screenBrightness,
  imageScale,
  imageOffsetX,
  imageOffsetY,
  modelX,
  modelY,
  modelZ,
  modelRotationX,
  modelRotationY,
  modelRotationZ,
  modelScale,
}: LoadedModelProps) => {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const fallbackScreenRatio = device.fallbackScreen.size[0] / device.fallbackScreen.size[1];

  useEffect(() => {
    let active = true;

    if (!imageUrl) {
      setTexture(null);
      return;
    }

    createScreenTexture(imageUrl, fallbackScreenRatio, imageFit, {
      scale: imageScale,
      offsetX: imageOffsetX,
      offsetY: imageOffsetY,
    })
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
  }, [fallbackScreenRatio, imageFit, imageOffsetX, imageOffsetY, imageScale, imageUrl]);

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
        } else if (device.materialTint && !isScreenCandidate(object, object.material)) {
          const existing = Array.isArray(object.material) ? object.material[0] : object.material;
          if (existing instanceof THREE.MeshStandardMaterial || existing instanceof THREE.MeshPhysicalMaterial) {
            const tinted = existing.clone();
            tinted.color.lerp(new THREE.Color(device.materialTint), 0.42);
            object.material = tinted;
          }
        }
      }
    });

    const bounds = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    bounds.getSize(size);
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    const targetSize = device.id.includes('macbook') ? 3.2 : 2.95;

    return { model: clone, hasScreenMesh: screenFound, fitScale: targetSize / maxDimension };
  }, [device.id, device.materialTint, screenBrightness, source, texture]);

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
    <group
      ref={groupRef}
      position={[modelX, modelY, modelZ]}
      rotation={[
        device.initialRotation[0] + modelRotationX,
        device.initialRotation[1] + modelRotationY,
        device.initialRotation[2] + modelRotationZ,
      ]}
      scale={device.scale * modelScale}
    >
      <Center>
        <group scale={fitScale}>
          <primitive object={model} />
          {texture ? (
            <mesh
              geometry={fallbackGeometry}
              position={device.fallbackScreen.position}
              rotation={device.fallbackScreen.rotation}
              renderOrder={5}
            >
              <meshBasicMaterial
                map={texture}
                toneMapped={false}
                side={THREE.DoubleSide}
                transparent
                opacity={hasScreenMesh ? 0.98 : 1}
              />
            </mesh>
          ) : null}
        </group>
      </Center>
    </group>
  );
};

export const DeviceModel = (props: DeviceModelProps) => {
  const gltf = useGLTF(publicAssetUrl(props.device.modelPath)) as unknown as { scene: THREE.Object3D };

  return <LoadedModel {...props} source={gltf.scene} />;
};
