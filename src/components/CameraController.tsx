'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/lib/store';
import { getFigurePositionRegistry } from './FigureGraph';

const MOVE_SPEED = 0.4;
const LERP_SPEED = 0.06;
const SPRINT_MULTIPLIER = 2.5;

export default function CameraController({
  nodeMap,
  controlsRef,
}: {
  nodeMap: Map<string, { x: number; y: number; z: number }>;
  controlsRef: React.RefObject<any>;
}) {
  const { camera } = useThree();
  const selectedTradition = useStore((s) => s.selectedTradition);
  const selectedFigure = useStore((s) => s.selectedFigure);
  const cameraPreset = useStore((s) => s.cameraPreset);
  const setCameraPreset = useStore((s) => s.setCameraPreset);
  const walkerTarget = useStore((s) => s.walkerTarget);
  const setWalkerTarget = useStore((s) => s.setWalkerTarget);

  const targetPos = useRef(new THREE.Vector3(60, 40, 60));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isAnimating = useRef(false);
  const keysPressed = useRef(new Set<string>());

  // Pending fly-to: figure ID we want to fly to but positions aren't ready yet.
  // useFrame will retry each frame until it finds the position.
  const pendingFigureFlyTo = useRef<string | null>(null);
  const pendingRetryFrames = useRef(0);

  // Track keyboard state
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      keysPressed.current.add(e.key.toLowerCase());
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const flyToPoint = useCallback(
    (x: number, y: number, z: number, dist: number) => {
      const nodePos = new THREE.Vector3(x, y, z);
      const dirFromNode = new THREE.Vector3()
        .subVectors(camera.position, nodePos)
        .normalize();
      targetPos.current.copy(nodePos).addScaledVector(dirFromNode, dist);
      targetLookAt.current.copy(nodePos);
      isAnimating.current = true;
    },
    [camera]
  );

  // Fly to selected tradition (positions always available in nodeMap)
  useEffect(() => {
    if (selectedTradition) {
      const node = nodeMap.get(selectedTradition.id);
      if (node) {
        flyToPoint(node.x, node.y, node.z, 15);
      }
    }
  }, [selectedTradition, nodeMap, flyToPoint]);

  // When a figure is selected, queue a pending fly-to.
  // The actual lookup happens in useFrame since positions may not exist yet
  // (e.g. figure layer was just toggled on in the same event).
  useEffect(() => {
    if (selectedFigure) {
      pendingFigureFlyTo.current = selectedFigure.id;
      pendingRetryFrames.current = 0;
    }
  }, [selectedFigure]);

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

  // Walker target — also queue as pending
  useEffect(() => {
    if (walkerTarget) {
      // Try tradition nodes first (always available)
      const tradPos = nodeMap.get(walkerTarget);
      if (tradPos) {
        flyToPoint(tradPos.x, tradPos.y, tradPos.z, 6);
      } else {
        // Queue for figure position retry
        pendingFigureFlyTo.current = walkerTarget;
        pendingRetryFrames.current = 0;
      }
      setWalkerTarget(null);
    }
  }, [walkerTarget, nodeMap, setWalkerTarget, flyToPoint]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    // --- Retry pending figure fly-to ---
    // Check every frame until position registry has the figure (up to 120 frames / 2 sec)
    if (pendingFigureFlyTo.current) {
      const registry = getFigurePositionRegistry();
      const pos = registry.get(pendingFigureFlyTo.current);
      if (pos) {
        flyToPoint(pos.x, pos.y, pos.z, 8);
        pendingFigureFlyTo.current = null;
        pendingRetryFrames.current = 0;
      } else {
        pendingRetryFrames.current++;
        if (pendingRetryFrames.current > 120) {
          // Give up after ~2 seconds
          pendingFigureFlyTo.current = null;
          pendingRetryFrames.current = 0;
        }
      }
    }

    // --- WASD Movement ---
    const keys = keysPressed.current;
    const hasMovement =
      keys.has('w') ||
      keys.has('a') ||
      keys.has('s') ||
      keys.has('d') ||
      keys.has('q') ||
      keys.has('e');

    if (hasMovement) {
      isAnimating.current = false;

      const sprint = keys.has('shift') ? SPRINT_MULTIPLIER : 1;
      const speed = MOVE_SPEED * sprint;

      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);

      const right = new THREE.Vector3();
      right.crossVectors(forward, camera.up).normalize();

      const up = new THREE.Vector3(0, 1, 0);

      const moveVec = new THREE.Vector3();

      if (keys.has('w')) moveVec.addScaledVector(forward, speed);
      if (keys.has('s')) moveVec.addScaledVector(forward, -speed);
      if (keys.has('a')) moveVec.addScaledVector(right, -speed);
      if (keys.has('d')) moveVec.addScaledVector(right, speed);
      if (keys.has('q')) moveVec.addScaledVector(up, -speed);
      if (keys.has('e')) moveVec.addScaledVector(up, speed);

      camera.position.add(moveVec);
      controls.target.add(moveVec);
      controls.update();
    }

    // --- Fly-to Animation ---
    if (isAnimating.current) {
      camera.position.lerp(targetPos.current, LERP_SPEED);
      controls.target.lerp(targetLookAt.current, LERP_SPEED);
      controls.update();

      const dist = camera.position.distanceTo(targetPos.current);
      if (dist < 0.3) {
        isAnimating.current = false;
      }
    }
  });

  return null;
}
