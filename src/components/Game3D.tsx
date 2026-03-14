'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Environment } from '@react-three/drei';
import { useState } from 'react';
import * as THREE from 'three';

// 3D 버튼 컴포넌트
function Button3D({ 
  label, 
  position, 
  onClick, 
  color = '#fbbf24' 
}: { 
  label: string; 
  position: [number, number, number]; 
  onClick: () => void;
  color?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      {/* 배경 박스 */}
      <mesh
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        scale={hovered ? [1.1, 1.1, 1.05] : [1, 1, 1]}
      >
        <boxGeometry args={[2, 1, 0.2]} />
        <meshStandardMaterial
          color={color}
          emissive={hovered ? color : '#000000'}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
      </mesh>

      {/* 텍스트 */}
      <Text
        position={[0, 0, 0.2]}
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
        color={hovered ? '#ffffff' : '#000000'}
      >
        {label}
      </Text>
    </group>
  );
}

// 스탯 디스플레이 (3D 패널)
function StatPanel({ position, stats }: { position: [number, number, number]; stats: any }) {
  return (
    <group position={position}>
      {/* 패널 배경 */}
      <mesh>
        <boxGeometry args={[4, 3, 0.1]} />
        <meshStandardMaterial
          color="#1a0f2e"
          metalness={0.3}
          roughness={0.4}
          emissive="#fbbf24"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* 테두리 */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[4.1, 3.1, 0.05]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {/* 타이틀 */}
      <Text
        position={[0, 1.2, 0.2]}
        fontSize={0.6}
        anchorX="center"
        color="#fbbf24"
      >
        STATS
      </Text>

      {/* 통계 텍스트들 */}
      <Text position={[-1.5, 0.5, 0.2]} fontSize={0.4} anchorX="left" color="#4ade80">
        Lv {stats.level}
      </Text>
      <Text position={[-1.5, 0.0, 0.2]} fontSize={0.4} anchorX="left" color="#f87171">
        ATK {stats.atk}
      </Text>
      <Text position={[-1.5, -0.5, 0.2]} fontSize={0.4} anchorX="left" color="#60a5fa">
        DEF {stats.def}
      </Text>
      <Text position={[-1.5, -1.0, 0.2]} fontSize={0.4} anchorX="left" color="#f472b6">
        HP {stats.hp}
      </Text>
    </group>
  );
}

// 메인 3D 씬
function Game3DScene({ gameState, onAttack }: { gameState: any; onAttack: () => void }) {
  return (
    <>
      {/* 카메라 */}
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={2}
      />

      {/* 조명 */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, 10, 10]} intensity={0.5} color="#fbbf24" />

      {/* 배경 */}
      <Environment preset="night" />

      {/* 바닥 */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0d0208" />
      </mesh>

      {/* 스탯 패널 */}
      <StatPanel
        position={[-5, 2, 0]}
        stats={{
          level: gameState.level,
          atk: gameState.atk,
          def: gameState.def,
          hp: gameState.hp,
        }}
      />

      {/* 공격 버튼 */}
      <Button3D
        label="ATTACK"
        position={[0, -1, 0]}
        onClick={onAttack}
        color="#dc2626"
      />

      {/* 몬스터 (임시) */}
      <mesh position={[5, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#ff4500"
          emissive="#ff6347"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* 몬스터 라벨 */}
      <Text position={[5, 2.5, 0]} fontSize={0.5} color="#ff4500">
        Monster
      </Text>
    </>
  );
}

// 메인 Game3D 컴포넌트
export default function Game3D({ gameState, onAttack }: { gameState: any; onAttack: () => void }) {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        style={{ background: 'linear-gradient(to bottom, #0d0208, #2d1b3d)' }}
      >
        <Game3DScene gameState={gameState} onAttack={onAttack} />
      </Canvas>

      {/* 상단 정보 패널 (HTML 오버레이) */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: '#fbbf24',
          fontFamily: 'Cinzel, serif',
          fontSize: 18,
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
          zIndex: 10,
        }}
      >
        <div>Gold: {gameState.gold.toLocaleString()}</div>
        <div>Level: {gameState.level}</div>
        <div>Exp: {gameState.exp}/100</div>
      </div>
    </div>
  );
}
