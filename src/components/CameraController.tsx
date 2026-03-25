'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/lib/store';

export default function CameraController({
  nodeMap,
  controlsRef,
}: {
  nodeMap: Map<string, { x: number; y: number; z: number }>;
  controlsRef: React.RefObject<any>;
}) {
  const { camera } = useThree();
  const selectedTradition = useStore((s) => s.selectedTradition);
  const cameraPreset = useStore((s) => s.cameraPreset);
  const setCameraPreset = useStore((s) => s.setCameraPreset);

  const targetPos = useRef(new THREE.Vector3(60, 40, 60));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isAnimating = useRef(false);

  // Fly to selected tradition
  useEffect(() => {
    if (selectedTradition) {
      const node = nodeMap.get(selectedTradition.id);
      if (node) {
        const nodePos = new THREE.Vector3(node.x, node.y, node.z);

        // Compute offset FROM the current camera direction so we approach
        // from the side the user is already viewing
        const dirFromNode = new THREE.Vector3()
          .subVectors(camera.position, nodePos)
          .normalize();

        // If camera is very far, use a closer approach distance
        const approachDist = 15;
        targetPos.current
          .copy(nodePos)
          .addScaledVector(dirFromNode, approachDist);

        targetLookAt.current.copy(nodePos);
        isAnimating.current = true;
      }
    }
  }, [selectedTradition, nodeMap, camera]);

  // Camera presets
  useEffect(() => {
    if (!cameraPreset) return;

    const presets: Record<string, { pos: THREE.Vector3; lookAt: THREE.Vector3 }> = {
      overview: {
        pos: new THREE.Vector3(60, 40, 60),
        lookAt: new THREE.Vector3(0, 0, 0),
      },
      abrahamic: {
        pos: new THREE.Vector3(-5, 8, 25),
        lookAt: new THREE.Vector3(-10, 0, 15),
      },
      indoEuropean: {
        pos: new THREE.Vector3(15, 25, 15),
        lookAt: new THREE.Vector3(0, 10, 5),
      },
      eastAsian: {
        pos: new THREE.Vector3(30, 8, -8),
        lookAt: new THREE.Vector3(25, 0, -12),
      },
      axialAge: {
        pos: new THREE.Vector3(0, 35, 35),
        lookAt: new THREE.Vector3(0, 5, 0),
      },
    };

    const preset = presets[cameraPreset];
    if (preset) {
      targetPos.current.copy(preset.pos);
      targetLookAt.current.copy(preset.lookAt);
      isAnimating.current = true;
    }
    setCameraPreset(null);
  }, [cameraPreset, setCameraPreset]);

  useFrame(() => {
    if (isAnimating.current) {
      // Lerp camera position
      camera.position.lerp(targetPos.current, 0.06);

      // Lerp the orbit controls target (this is what the camera looks at)
      if (controlsRef.current) {
        const controls = controlsRef.current;
        controls.target.lerp(targetLookAt.current, 0.06);
        controls.update();
      }

      const dist = camera.position.distanceTo(targetPos.current);
      if (dist < 0.3) {
        isAnimating.current = false;
      }
    }
  });

  return null;
}
