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
    <div className="flex flex-col w-full h-full min-h-0">
      <header className="flex items-center gap-4 px-5 py-3 bg-white border-b border-slate-200 shadow-sm flex-wrap">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">3D Editor</h1>
        <p className="text-sm text-slate-500">
          Double-click the canvas to add an object. Click to select, drag to move.
        </p>
        <button
          type="button"
          onClick={handleDeleteAll}
          disabled={objects.length === 0}
          className="ml-auto rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Delete all objects
        </button>
      </header>
      <div className="flex flex-1 min-h-0 min-w-0">
        <div className="relative min-w-0 flex-1 bg-slate-100">
          {objectsLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                <p className="text-sm text-slate-600">Loading scene...</p>
              </div>
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
