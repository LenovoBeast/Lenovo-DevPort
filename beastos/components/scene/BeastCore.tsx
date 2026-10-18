"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Soft round sprite, generated once — avoids shipping a texture file. */
/* ------------------------------------------------------------------ */
function useSprite(): THREE.CanvasTexture {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.3, "rgba(150,220,255,0.6)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

/* ------------------------------------------------------------------ */
/* Particle shell                                                      */
/* ------------------------------------------------------------------ */
function Particles({ count }: { count: number }) {
  const sprite = useSprite();
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.1 + Math.random() * 2.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.cos(phi) * 0.72;
      arr[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.045;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        size={0.055}
        sizeAttenuation
        transparent
        depthWrite={false}
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        color="#9ad9ff"
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Billboard bloom — fakes volumetric light without post-processing    */
/* ------------------------------------------------------------------ */
function Bloom() {
  const sprite = useSprite();
  return (
    <sprite scale={[4.8, 4.8, 1]}>
      <spriteMaterial
        map={sprite}
        color="#1f9dff"
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  );
}

/* ------------------------------------------------------------------ */
/* Wireframe core + inner glow                                         */
/* ------------------------------------------------------------------ */
function Core() {
  const shell = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (shell.current) {
      shell.current.rotation.y += delta * 0.16;
      shell.current.rotation.x += delta * 0.045;
    }
    if (inner.current) {
      const s = 1 + Math.sin(t * 1.4) * 0.045;
      inner.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      <Bloom />

      <mesh ref={shell}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color="#5ccfff" wireframe transparent opacity={0.42} />
      </mesh>

      {/* Faint inner lattice — additive at low alpha so it reads as volume,
          not a solid ball. */}
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.66, 1]} />
        <meshBasicMaterial
          color="#3ba7ff"
          wireframe
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Bright singularity at the centre */}
      <mesh>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshBasicMaterial color="#7fdcff" transparent opacity={0.28} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Soft halo */}
      <mesh scale={2.4}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Orbital rings                                                       */
/* ------------------------------------------------------------------ */
function Rings() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.06;
  });

  const rings: Array<{ r: number; tilt: [number, number, number]; color: string; opacity: number }> = [
    { r: 1.75, tilt: [1.35, 0.2, 0], color: "#00d4ff", opacity: 0.35 },
    { r: 2.25, tilt: [1.1, -0.35, 0.4], color: "#0066ff", opacity: 0.28 },
    { r: 2.85, tilt: [1.5, 0.15, -0.3], color: "#7c3aed", opacity: 0.22 },
  ];

  return (
    <group ref={group}>
      {rings.map((ring, i) => (
        <mesh key={i} rotation={ring.tilt}>
          <torusGeometry args={[ring.r, 0.0035, 8, 160]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={ring.opacity}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Pointer-driven parallax                                             */
/* ------------------------------------------------------------------ */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.4, 0.04);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.24, 0.04);
  });

  return <group ref={group}>{children}</group>;
}

/* ------------------------------------------------------------------ */
/* Public component                                                    */
/* ------------------------------------------------------------------ */
export default function BeastCore({ particleCount = 620 }: { particleCount?: number }) {
  const [visible, setVisible] = useState(true);
  const host = useRef<HTMLDivElement>(null);

  // Stop the render loop when the hero scrolls away — saves battery and GPU.
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.01,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className="absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 6.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Rig>
          <Core />
          <Rings />
          <Particles count={particleCount} />
        </Rig>
      </Canvas>
    </div>
  );
}
