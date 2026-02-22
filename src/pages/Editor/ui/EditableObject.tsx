import { useRef } from 'react';
import type { Group, Object3D } from 'three';
import { TransformControls } from '@react-three/drei';
import type { RefObject } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import type { SceneObject } from '../../../entities/object/model/types';
import { sizeToScale } from '../lib/sizeScale';

const HOVER_COLOR = '#f59e0b';
const SELECT_COLOR = '#3b82f6';

interface EditableObjectProps {
  object: SceneObject;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onPositionChange: (id: string, position: { x: number; y: number; z: number }) => void;
}

export function EditableObject({
  object,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onPositionChange,
}: EditableObjectProps) {
  const groupRef = useRef<Group>(null);
  const scale = sizeToScale[object.size];
  const color = isSelected ? SELECT_COLOR : isHovered ? HOVER_COLOR : object.color;

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(object.id);
  };

  const handlePointerOut = () => {
    onHover(null);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(object.id);
  };

  const handleDragEnd = () => {
    const group = groupRef.current;
    if (group) {
      onPositionChange(object.id, {
        x: group.position.x,
        y: group.position.y,
        z: group.position.z,
      });
    }
  };

  return (
    <>
      {isSelected && (
        <TransformControls
          object={groupRef as RefObject<Object3D>}
          mode="translate"
          onMouseUp={handleDragEnd}
        />
      )}
      <group
        ref={groupRef}
        position={[object.position.x, object.position.y, object.position.z]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <mesh scale={scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </>
  );
}
