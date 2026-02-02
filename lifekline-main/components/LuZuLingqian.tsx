/**
 * 吕祖灵签模块 - 3D 增强版
 * 使用 React Three Fiber 实现真实掷筊与抽签动画
 */

import { useState, useRef, useMemo, Suspense, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
  Float
} from '@react-three/drei';
import * as THREE from 'three';
import {
  LuZuLingqian as LuZuLingqianType,
  ShengbeiResult,
  SHENGBEI_CONFIGS,
  LUZU_LINGQIAN,
  throwShengbei,
  getTraditionalNumber,
  LUZU_LINGQIAN_TITLE,
  LUZU_LINGQIAN_INTRO,
  LUZU_LINGQIAN_GUIDE_TITLE,
  LUZU_LINGQIAN_GUIDE
} from '../constants/luzuLingqian';
import { ChevronLeft, HelpCircle, Sparkles, RotateCcw, Home } from 'lucide-react';

interface LuZuLingqianProps {
  onBack: () => void;
}

type Stage = 'intro' | 'shengbei' | 'drawing' | 'result';

// --- 3D Components ---

/**
 * 筊杯 (Jiaobei) 3D 模型 - 真实拟真版
 */
function JiaobeiModel({
  position,
  rotation,
  isFlipping
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  isFlipping: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 48, 24);
    const posAttribute = geo.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < posAttribute.count; i++) {
      vertex.fromBufferAttribute(posAttribute, i);

      // 变形逻辑
      vertex.x *= 1.5;
      vertex.y *= 0.6;
      vertex.z *= 0.8;

      const bend = Math.pow(vertex.x * 0.35, 2) * 1.5;
      vertex.z += bend;

      if (vertex.y < -0.05) {
        vertex.y = -0.05;
      }

      const dist = Math.abs(vertex.x);
      const taper = Math.max(0, 1 - Math.pow(dist * 0.25, 3));
      vertex.z *= taper;
      vertex.y *= taper;

      posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    if (isFlipping) {
      meshRef.current.rotation.x += delta * 15;
      meshRef.current.rotation.z += delta * 8;
      const t = state.clock.elapsedTime;
      meshRef.current.position.y = 2 + Math.abs(Math.sin(t * 8)) * 1.5;
    } else {
      const targetRotation = new THREE.Euler(...rotation);
      const lerpFactor = 0.1;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotation.x, lerpFactor);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotation.y, lerpFactor);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotation.z, lerpFactor);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, position[1], lerpFactor);
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, position[0], lerpFactor);
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="#6F1A1A"
          roughness={0.2}
          metalness={0.1}
          emissive="#330000"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}

/**
 * 掷筊场景
 */
function ShengbeiScene({ isFlipping, result }: { isFlipping: boolean; result: ShengbeiResult | null }) {
  const ROT_ROUND_UP: [number, number, number] = [0, 0, 0];
  const ROT_FLAT_UP: [number, number, number] = [Math.PI, 0, 0];
  const noise = (Math.random() - 0.5) * 0.2;

  const leftRotation = useMemo((): [number, number, number] => {
    if (!result) return ROT_ROUND_UP;
    if (result === 'shengbei') return ROT_ROUND_UP;
    if (result === 'xiaobei') return [ROT_FLAT_UP[0], noise, noise];
    return ROT_ROUND_UP;
  }, [result]);

  const rightRotation = useMemo((): [number, number, number] => {
    if (!result) return ROT_ROUND_UP;
    if (result === 'shengbei') return [ROT_FLAT_UP[0], -noise, noise];
    if (result === 'xiaobei') return [ROT_FLAT_UP[0], -noise, -noise];
    return ROT_ROUND_UP;
  }, [result]);

  return (
    <group>
      <Float speed={isFlipping ? 20 : 0} rotationIntensity={isFlipping ? 2 : 0} floatIntensity={isFlipping ? 2 : 0}>
        <JiaobeiModel position={[-1.0, 0, 0]} rotation={isFlipping ? [0, 0, 0] : leftRotation} isFlipping={isFlipping} />
        <JiaobeiModel position={[1.0, 0, 0]} rotation={isFlipping ? [0, 0, 0] : rightRotation} isFlipping={isFlipping} />
      </Float>
      <ContactShadows position={[0, -0.6, 0]} opacity={0.4} scale={15} blur={2} far={4} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="#3a3a3a" opacity={0.05} transparent />
      </mesh>
    </group>
  );
}

/**
 * 竹签模型 - 扁平长条状
 */
function StickModel({ isRedTip = false }: { isRedTip?: boolean }) {
  // 扁平尺寸：宽0.5, 厚0.08, 长6
  return (
    <group>
      {/* Stick Body */}
      <mesh>
        <boxGeometry args={[0.5, 6, 0.08]} />
        <meshStandardMaterial color="#F4A460" roughness={0.6} />
      </mesh>
      {/* Red Tip */}
      {isRedTip && (
        <mesh position={[0, 3, 0]}>
          <boxGeometry args={[0.51, 0.5, 0.09]} />
          <meshStandardMaterial color="#8B0000" />
        </mesh>
      )}
    </group>
  );
}

/**
 * 掉落的签
 */
function DroppingStick({ show }: { show: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const [active, setActive] = useState(false);
  const startTime = useRef(0);

  useFrame((state) => {
    if (show && !active) {
      setActive(true);
      startTime.current = state.clock.elapsedTime;
    }

    if (active && meshRef.current) {
      const t = (state.clock.elapsedTime - startTime.current) * 1.5;

      if (t < 1) {
        // Rise
        meshRef.current.position.y = THREE.MathUtils.lerp(2, 5, t);
        meshRef.current.rotation.x = THREE.MathUtils.lerp(0, Math.PI / 4, t);
      } else if (t < 2.5) {
        // Fall
        const p = (t - 1) / 1.5;
        meshRef.current.position.y = THREE.MathUtils.lerp(5, 0, p * p);
        meshRef.current.position.z = THREE.MathUtils.lerp(0, 4, p);
        meshRef.current.rotation.x = THREE.MathUtils.lerp(Math.PI / 4, Math.PI / 2, p);
      }
    } else if (!show && meshRef.current) {
      meshRef.current.position.set(0, -10, 0);
      setActive(false);
    }
  });

  return (
    <group ref={meshRef} position={[0, -10, 0]}>
      <StickModel isRedTip />
    </group>
  );
}

/**
 * 竹筒场景
 */
function BambooScene({ isShaking, showStick }: { isShaking: boolean; showStick: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (isShaking && groupRef.current) {
      const t = state.clock.elapsedTime * 25;
      groupRef.current.rotation.z = Math.sin(t) * 0.15;
      groupRef.current.rotation.x = (Math.cos(t * 1.2) * 0.1) - 0.2;
      groupRef.current.position.y = Math.abs(Math.sin(t * 2)) * 0.3;
    } else if (groupRef.current) {
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -0.2, 0.1);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1);
    }
  });

  return (
    <group>
      <group ref={groupRef}>
        {/* Tube */}
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[1.6, 1.5, 5, 32, 1, true]} />
          <meshStandardMaterial color="#D2B48C" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 2, 0]} scale={[0.98, 1, 0.98]}>
          <cylinderGeometry args={[1.6, 1.5, 5, 32, 1, true]} />
          <meshStandardMaterial color="#5C3317" side={THREE.BackSide} />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>

        {/* Sticks inside - updated to flat strips */}
        {Array.from({ length: 18 }).map((_, i) => (
          <group
            key={i}
            position={[
              Math.sin(i * 137.5) * 0.9,
              2.5 + Math.random() * 0.5,
              Math.cos(i * 137.5) * 0.9
            ]}
            rotation={[
              (Math.random() - 0.5) * 0.3,
              Math.random() * Math.PI, // Random Y rotation for flat sticks looks better
              (Math.random() - 0.5) * 0.3
            ]}
          >
            <StickModel isRedTip />
          </group>
        ))}
      </group>

      <DroppingStick show={showStick} />
      <ContactShadows position={[0, -0.6, 0]} opacity={0.5} scale={15} blur={2} />
    </group>
  );
}

export default function LuZuLingqian({ onBack }: LuZuLingqianProps) {
  const [stage, setStage] = useState<Stage>('intro');
  const [shengbeiResult, setShengbeiResult] = useState<ShengbeiResult | null>(null);
  const [isShengbeiFlipping, setIsShengbeiFlipping] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [drawnNumber, setDrawnNumber] = useState<number | null>(null);
  const [revealedLot, setRevealedLot] = useState<LuZuLingqianType | null>(null);
  const [showStick, setShowStick] = useState(false);

  // Handlers
  const handleThrowShengbei = useCallback(() => {
    if (isShengbeiFlipping) return;
    setIsShengbeiFlipping(true);
    setShengbeiResult(null);
    setTimeout(() => {
      const finalResult = throwShengbei();
      setShengbeiResult(finalResult);
      setIsShengbeiFlipping(false);
      if (finalResult === 'shengbei') setTimeout(() => setStage('drawing'), 1500);
    }, 2000);
  }, [isShengbeiFlipping]);

  const handleDraw = useCallback(() => {
    if (isShaking) return;
    setIsShaking(true);
    setShowStick(false);
    setTimeout(() => {
      const randomNumber = Math.floor(Math.random() * 100) + 1;
      setDrawnNumber(randomNumber);
      setIsShaking(false);
      setShowStick(true);
      setTimeout(() => {
        const lot = LUZU_LINGQIAN.find(q => q.number === randomNumber);
        if (lot) {
          setRevealedLot(lot);
          setStage('result');
        }
      }, 3000);
    }, 2000);
  }, [isShaking]);

  const handleRestart = useCallback(() => {
    setStage('intro');
    setShengbeiResult(null);
    setDrawnNumber(null);
    setRevealedLot(null);
    setShowStick(false);
  }, []);

  // Renderers
  const renderTitle = () => (
    // Check z-index: increased to 50 to stay above result overlay if needed, 
    // or just ensuring it's clickable.
    <div className="absolute top-0 left-0 w-full z-50 p-4 flex justify-between items-start pointer-events-none">
      <div className="pointer-events-auto">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-paper-100/90 backdrop-blur border border-ink-200 rounded-full shadow-lg text-ink-800 hover:bg-paper-200 transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="font-serif font-bold">返回主页</span>
        </button>
      </div>
      <div className="text-right pointer-events-auto">
        <button onClick={() => setStage('intro')} className="p-2 bg-paper-100/90 backdrop-blur rounded-full text-ink-600 hover:text-ink-900 shadow-md">
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  const renderIntroOverlay = () => (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-paper-50/90 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in-up">
        <h2 className="text-4xl font-serif font-bold text-ink-900 mb-6">{LUZU_LINGQIAN_TITLE}</h2>
        <div className="text-ink-700 leading-relaxed text-lg space-y-4 font-serif">
          {LUZU_LINGQIAN_INTRO.map((line, index) => <p key={index}>{line}</p>)}
        </div>
        <div className="bg-paper-200/50 p-6 rounded-xl border border-ink-100 text-left">
          <h3 className="text-lg font-bold text-ink-800 mb-3">{LUZU_LINGQIAN_GUIDE_TITLE}</h3>
          <ul className="space-y-2 text-ink-600 text-sm">
            {LUZU_LINGQIAN_GUIDE.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <button onClick={() => setStage('shengbei')} className="px-10 py-4 bg-ink-900 text-paper-50 text-xl font-serif font-bold rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-3 mx-auto">
          <Sparkles className="w-6 h-6" />
          <span>诚心求签</span>
        </button>
      </div>
    </div>
  );

  const renderResultOverlay = () => {
    if (!revealedLot) return null;
    return (
      <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4 bg-paper-50/95 backdrop-blur overflow-y-auto animate-fade-in">
        <div className="max-w-xl w-full bg-paper-100 border-2 border-ink-800 p-8 rounded-sm shadow-2xl my-auto relative">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-800 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-red-800 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-red-800 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-red-800 rounded-br-lg" />

          <div className="text-center mb-6">
            <span className="inline-block px-4 py-1 bg-red-800 text-paper-50 text-sm font-bold tracking-widest rounded-full mb-2">吕祖灵签</span>
            <h2 className="text-3xl font-serif font-bold text-ink-900">{revealedLot.title}</h2>
          </div>
          <div className="bg-paper-200/50 p-6 rounded-lg text-center mb-6">
            {revealedLot.qianwen.map((line, i) => (
              <p key={i} className="text-xl font-serif text-ink-800 leading-loose border-b border-ink-100/50 last:border-0 pb-2 last:pb-0 mb-2 last:mb-0">{line}</p>
            ))}
          </div>
          <div className="space-y-2 text-ink-600 border-t border-ink-200 pt-4">
            <h4 className="font-bold text-ink-800 flex items-center gap-2"><span className="w-2 h-2 bg-red-700 rounded-full" />解曰</h4>
            {revealedLot.jieyue.map((line, i) => <p key={i} className="text-sm leading-relaxed">{line}</p>)}
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <button onClick={handleRestart} className="px-6 py-3 bg-ink-800 text-paper-50 font-bold rounded-lg hover:bg-ink-700 transition-colors flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />再求一签
            </button>
            <button onClick={onBack} className="px-6 py-3 bg-paper-200 text-ink-800 font-bold rounded-lg hover:bg-paper-300 transition-colors flex items-center gap-2 border border-ink-300">
              <Home className="w-4 h-4" />返回主页
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-screen bg-[#F0EBE0] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-paper-100 to-paper-300 pointer-events-none" />

      {renderTitle()}
      {stage === 'intro' && renderIntroOverlay()}
      {stage === 'result' && renderResultOverlay()}

      <div className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 8, 12]} fov={40} />
          <ambientLight intensity={0.6} color="#fff0e0" />
          <spotLight position={[5, 12, 5]} angle={0.4} penumbra={1} intensity={1.2} castShadow />
          <Environment preset="sunset" blur={0.8} />

          <Suspense fallback={null}>
            {(stage === 'shengbei' || stage === 'intro') && (
              <ShengbeiScene isFlipping={isShengbeiFlipping} result={shengbeiResult} />
            )}

            {stage === 'drawing' && (
              <BambooScene isShaking={isShaking} showStick={showStick} />
            )}
          </Suspense>

          <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.2} />
        </Canvas>
      </div>

      {stage !== 'intro' && stage !== 'result' && (
        <div className="absolute bottom-16 left-0 w-full z-10 text-center pointer-events-none">
          <div className="inline-block pointer-events-auto bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl">
            <h3 className="text-xl font-serif font-bold text-ink-900 mb-2">
              {stage === 'shengbei' ? (shengbeiResult ? SHENGBEI_CONFIGS[shengbeiResult].name : '虔诚掷杯') : '摇筒求签'}
            </h3>
            {stage === 'shengbei' && (
              <>
                {shengbeiResult ? (
                  <div className="mb-4">
                    <p className="text-ink-600 mb-4">{SHENGBEI_CONFIGS[shengbeiResult].meaning}</p>
                    {shengbeiResult === 'shengbei' ? (
                      <div className="text-green-700 font-bold animate-pulse">
                        神明应允，即将开始抽签...
                      </div>
                    ) : (
                      <button onClick={handleThrowShengbei} className="px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-lg">重新掷杯</button>
                    )}
                  </div>
                ) : (
                  <button onClick={handleThrowShengbei} disabled={isShengbeiFlipping} className="px-8 py-3 bg-ink-800 text-paper-50 rounded-lg text-lg font-bold hover:bg-ink-700 transition-all active:scale-95 disabled:opacity-50">
                    {isShengbeiFlipping ? '掷杯中...' : '点击掷杯'}
                  </button>
                )}
              </>
            )}
            {stage === 'drawing' && (
              <>
                {showStick ? (
                  <p className="text-ink-800 font-bold animate-tick-slide">
                    {drawnNumber ? `第 ${getTraditionalNumber(drawnNumber)} 签` : '...'}<br />
                    <span className="text-sm font-normal text-ink-600">正在解签...</span>
                  </p>
                ) : (
                  <button onClick={handleDraw} disabled={isShaking} className="px-8 py-3 bg-ink-800 text-paper-50 rounded-lg text-lg font-bold hover:bg-ink-700 transition-all active:scale-95 disabled:opacity-50">
                    {isShaking ? '请诚心摇动...' : '点击摇签'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
