'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/lib/store';

const MOVE_SPEED = 0.4;
const LERP_SPEED = 0.06;
const SPRINT_MULTIPLIER = 2.5;

export default function CameraController({
  nodeMap,
  figurePositionMap,
  controlsRef,
}: {
  nodeMap: Map<string, { x: number; y: number; z: number }>;
  figurePositionMap?: Map<string, { x: number; y: number; z: number }>;
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

  // Track keyboard state
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't capture if user is typing in an input
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

  // Fly to selected tradition
  useEffect(() => {
    if (selectedTradition) {
      const node = nodeMap.get(selectedTradition.id);
      if (node) {
        flyToPoint(node.x, node.y, node.z, 15);
      }
    }
  }, [selectedTradition, nodeMap]);

  // Fly to selected figure
  useEffect(() => {
    if (selectedFigure && figurePositionMap) {
      const pos = figurePositionMap.get(selectedFigure.id);
      if (pos) {
        flyToPoint(pos.x, pos.y, pos.z, 8);
      }
    }
  }, [selectedFigure, figurePositionMap]);

  // Graph walker target
  useEffect(() => {
    if (walkerTarget) {
      // Check figure positions first, then tradition nodes
      let pos: { x: number; y: number; z: number } | undefined;
      if (figurePositionMap) {
        pos = figurePositionMap.get(walkerTarget);
      }
      if (!pos) {
        pos = nodeMap.get(walkerTarget);
      }
      if (pos) {
        flyToPoint(pos.x, pos.y, pos.z, 6);
      }
      setWalkerTarget(null);
    }
  }, [walkerTarget, figurePositionMap, nodeMap, setWalkerTarget]);

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

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

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
      // Cancel any fly-to animation when user takes manual control
      isAnimating.current = false;

      const sprint = keys.has('shift') ? SPRINT_MULTIPLIER : 1;
      const speed = MOVE_SPEED * sprint;

      // Forward vector (camera look direction, projected to XZ plane for W/S)
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);

      // Right vector
      const right = new THREE.Vector3();
      right.crossVectors(forward, camera.up).normalize();

      // Up vector (world up)
      const up = new THREE.Vector3(0, 1, 0);

      const moveVec = new THREE.Vector3();

      if (keys.has('w')) moveVec.addScaledVector(forward, speed);
      if (keys.has('s')) moveVec.addScaledVector(forward, -speed);
      if (keys.has('a')) moveVec.addScaledVector(right, -speed);
      if (keys.has('d')) moveVec.addScaledVector(right, speed);
      if (keys.has('q')) moveVec.addScaledVector(up, -speed);
      if (keys.has('e')) moveVec.addScaledVector(up, speed);

      // Move both camera and orbit target together (translates the whole rig)
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
