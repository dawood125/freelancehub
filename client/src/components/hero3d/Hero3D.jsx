import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * AnimatedMeshBlob
 * A living, breathing 3D blob that morphs and distorts continuously.
 * Creates the "alive" feeling of a premium hero animation.
 */
const AnimatedMeshBlob = ({ position, color, scale = 1, speed = 1 }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() * speed;
    meshRef.current.rotation.x = t * 0.15;
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.3;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <Sphere ref={meshRef} args={[1, 128, 128]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.45}
          speed={2.2}
          roughness={0.15}
          metalness={0.85}
          emissive={color}
          emissiveIntensity={0.25}
        />
      </Sphere>
    </Float>
  );
};

/**
 * ParticleField
 * Ambient particles floating in 3D space — adds depth and "atmosphere".
 */
const ParticleField = ({ count = 1200 }) => {
  const pointsRef = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.1;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#a78bfa"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
};

/**
 * MouseFollowerBlob
 * A larger 3D sphere that follows the mouse cursor smoothly.
 * Creates an interactive, alive feel.
 */
const MouseFollowerBlob = () => {
  const meshRef = useRef();
  const targetPos = useRef([0, 0, 0]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Smooth interpolation toward mouse position (normalized -1 to 1)
    const targetX = state.mouse.x * 3;
    const targetY = state.mouse.y * 2;
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05;
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <Sphere ref={meshRef} args={[0.7, 64, 64]} position={[0, 0, -2]}>
        <MeshDistortMaterial
          color="#ec4899"
          attach="material"
          distort={0.5}
          speed={3}
          roughness={0.1}
          metalness={0.9}
          emissive="#ec4899"
          emissiveIntensity={0.3}
        />
      </Sphere>
    </Float>
  );
};

/**
 * HeroScene
 * Composes all 3D elements into a stunning, premium hero background.
 * Designed to be performant and beautiful.
 */
const HeroScene = () => {
  return (
    <>
      {/* Ambient particles for depth */}
      <ParticleField count={900} />

      {/* Mouse-following main blob (interactive centerpiece) */}
      <MouseFollowerBlob />

      {/* Floating background blobs (atmosphere) */}
      <AnimatedMeshBlob
        position={[-4.5, 1.5, -3]}
        color="#8b5cf6"
        scale={1.3}
        speed={0.8}
      />
      <AnimatedMeshBlob
        position={[4.5, -1.2, -4]}
        color="#06b6d4"
        scale={1.1}
        speed={1.1}
      />
      <AnimatedMeshBlob
        position={[3, 2.5, -5]}
        color="#f43f5e"
        scale={0.9}
        speed={0.9}
      />
      <AnimatedMeshBlob
        position={[-3.5, -2, -3.5]}
        color="#10b981"
        scale={1.0}
        speed={1.2}
      />
    </>
  );
};

/**
 * Hero3D
 * The complete 3D hero background — mounted as a full-screen canvas.
 * Pointer events disabled so underlying content remains interactive.
 */
const Hero3D = () => {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        {/* Lighting setup for premium feel */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-5, 3, 2]} intensity={1.5} color="#a78bfa" />
        <pointLight position={[5, -2, 3]} intensity={1.0} color="#ec4899" />

        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Hero3D;
