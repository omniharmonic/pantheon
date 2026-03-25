'use client';

import { useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense } from 'react';
import ForceGraph from './ForceGraph';
import ParticleField from './ParticleField';
import { useStore } from '@/lib/store';

function SceneContent() {
  const controlsRef = useRef<any>(null);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[50, 50, 50]} intensity={0.8} color="#aaccff" />
      <pointLight position={[-50, -30, -50]} intensity={0.4} color="#ffaa66" />

      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={150}
        enablePan
      />

      {/* Background */}
      <Stars
        radius={100}
        depth={80}
        count={3000}
        factor={3}
        saturation={0.1}
        fade
        speed={0.3}
      />
      <ParticleField />

      {/* Main graph */}
      <Suspense fallback={null}>
        <ForceGraph controlsRef={controlsRef} />
      </Suspense>
    </>
  );
}

export default function Scene() {
  const setSelectedTradition = useStore((s) => s.setSelectedTradition);

  // Click on empty space to deselect
  const handleMissedClick = useCallback(() => {
    setSelectedTradition(null);
  }, [setSelectedTradition]);

  return (
    <Canvas
      camera={{ position: [60, 40, 60], fov: 50, near: 0.1, far: 500 }}
      style={{ background: '#050510' }}
      gl={{ antialias: true, alpha: false }}
      onPointerMissed={handleMissedClick}
    >
      <color attach="background" args={['#050510']} />
      <SceneContent />
    </Canvas>
  );
}
