import { useRef } from 'react';
import type { Mesh } from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { EditableObject } from './EditableObject';
import type { SceneObject } from '../../../entities/object/model/types';

interface SceneProps {
  objects: SceneObject[];
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onDoubleClickGround: (point: { x: number; y: number; z: number }) => void;
  onPositionChange: (id: string, position: { x: number; y: number; z: number }) => void;
}

export function Scene({
  objects,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  onDoubleClickGround,
  onPositionChange,
}: SceneProps) {
  const groundRef = useRef<Mesh>(null);

  const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const point = e.point;
    onDoubleClickGround({ x: point.x, y: 0, z: point.z });
  };

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <mesh
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onDoubleClick={handleDoubleClick}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      <gridHelper args={[50, 50, '#9ca3af', '#d1d5db']} position={[0, 0.01, 0]} />
      {objects.map((obj) => (
        <EditableObject
          key={obj.id}
          object={obj}
          isSelected={selectedId === obj.id}
          isHovered={hoveredId === obj.id}
          onSelect={onSelect}
          onHover={onHover}
          onPositionChange={onPositionChange}
        />
      ))}
    </>
  );
}
