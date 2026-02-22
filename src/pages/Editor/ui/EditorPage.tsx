import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGetObjectsQuery } from '../../../entities/object/api/objectApi';
import { useGetDesignersQuery } from '../../../entities/designer/api/designerApi';
import {
  useAddObjectMutation,
  useUpdateObjectMutation,
  useDeleteObjectMutation,
  useDeleteAllObjectsMutation,
} from '../../../entities/object/api/objectApi';
import type { SceneObject } from '../../../entities/object/model/types';
import { Scene } from './Scene';
import { AddObjectModal } from './AddObjectModal';
import { ObjectPropertiesPanel } from './ObjectPropertiesPanel';

export const EditorPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [pendingPosition, setPendingPosition] = useState<{ x: number; y: number; z: number } | null>(null);

  const { data: objects = [], isLoading: objectsLoading } = useGetObjectsQuery();
  const { data: designers = [] } = useGetDesignersQuery();
  const [addObject] = useAddObjectMutation();
  const [updateObject] = useUpdateObjectMutation();
  const [deleteObject] = useDeleteObjectMutation();
  const [deleteAllObjects] = useDeleteAllObjectsMutation();

  const handleDoubleClickGround = useCallback((point: { x: number; y: number; z: number }) => {
    setPendingPosition(point);
    setAddModalOpen(true);
  }, []);

  const handleAddSubmit = useCallback(
    (data: Omit<SceneObject, 'id'>) => {
      addObject(data);
      setAddModalOpen(false);
      setPendingPosition(null);
    },
    [addObject]
  );

  const handlePositionChange = useCallback(
    (id: string, position: { x: number; y: number; z: number }) => {
      updateObject({ id, body: { position } });
    },
    [updateObject]
  );

  const handleUpdateObject = useCallback(
    (id: string, data: Partial<Omit<SceneObject, 'id'>>) => {
      updateObject({ id, body: data });
    },
    [updateObject]
  );

  const handleDeleteObject = useCallback(
    (id: string) => {
      deleteObject(id);
      setSelectedId(null);
    },
    [deleteObject]
  );

  const handleDeleteAll = useCallback(() => {
    if (window.confirm('Delete all objects from the scene?')) {
      deleteAllObjects();
      setSelectedId(null);
    }
  }, [deleteAllObjects]);

  const selectedObject = selectedId
    ? (objects.find((o) => o.id === selectedId) ?? null)
    : null;

  return (
    <div className="flex flex-col w-full h-[calc(100vh-0px)]">
      <div className="flex items-center gap-4 px-4 py-2 bg-gray-100 border-b border-gray-200 flex-wrap">
        <h1 className="text-xl font-semibold text-gray-800">3D Editor</h1>
        <p className="text-sm text-gray-600">
          Double-click on the canvas to add an object. Click objects to select and drag to move.
        </p>
        <button
          type="button"
          onClick={handleDeleteAll}
          disabled={objects.length === 0}
          className="ml-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-red-500"
        >
          Delete all objects
        </button>
      </div>
      <div className="flex flex-1 min-h-0 ">
        <div className="flex-1 relative">
          {objectsLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <p className="text-gray-600">Loading scene...</p>
            </div>
          ) : (
            <Canvas
              className="w-full h-full"
              camera={{ position: [0, 8, 12], fov: 50 }}
              gl={{ antialias: true }}
              onPointerMissed={() => setSelectedId(null)}
            >
              <Scene
                objects={objects}
                selectedId={selectedId}
                hoveredId={hoveredId}
                onSelect={setSelectedId}
                onHover={setHoveredId}
                onDoubleClickGround={handleDoubleClickGround}
                onPositionChange={handlePositionChange}
              />
            </Canvas>
          )}
        </div>
        {selectedObject && (
          <ObjectPropertiesPanel
            object={selectedObject}
            designers={designers}
            onUpdate={handleUpdateObject}
            onDelete={handleDeleteObject}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>
      <AddObjectModal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setPendingPosition(null);
        }}
        designers={designers}
        position={pendingPosition ?? { x: 0, y: 0, z: 0 }}
        onSubmit={handleAddSubmit}
      />
    </div>
  );
};
