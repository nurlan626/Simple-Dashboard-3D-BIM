export type ObjectSize = 'small' | 'normal' | 'large';

export type SceneObject = {
  id: string;
  name: string;
  attachedDesignerId: string;
  color: string;
  position: { x: number; y: number; z: number };
  size: ObjectSize;
};
