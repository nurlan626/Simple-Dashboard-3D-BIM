import { useState, useEffect } from 'react';
import type { Designer } from '../../../entities/designer/model/types';
import type { ObjectSize, SceneObject } from '../../../entities/object/model/types';

const SIZE_OPTIONS: { value: ObjectSize; label: string }[] = [
  { value: 'small', label: 'Small' },
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Large' },
];

interface ObjectPropertiesPanelProps {
  object: SceneObject | null;
  designers: Designer[];
  onUpdate: (id: string, data: Partial<Omit<SceneObject, 'id'>>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function ObjectPropertiesPanel({
  object,
  designers,
  onUpdate,
  onDelete,
  onClose,
}: ObjectPropertiesPanelProps) {
  const [name, setName] = useState('');
  const [designerId, setDesignerId] = useState('');
  const [size, setSize] = useState<ObjectSize>('normal');
  const [color, setColor] = useState('#6b7280');
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (object) {
      setName(object.name);
      setDesignerId(object.attachedDesignerId);
      setSize(object.size);
      setColor(object.color);
      setErrors({});
    }
  }, [object]);

  if (!object) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrors({ name: 'Name is required' });
      return;
    }
    setErrors({});
    onUpdate(object.id, {
      name: trimmedName,
      attachedDesignerId: designerId,
      size,
      color,
    });
  };

  return (
    <div className="w-72 bg-white border-l border-gray-200 shadow-lg flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Object properties</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1 rounded focus:ring-2 focus:ring-blue-500"
          aria-label="Close panel"
        >
          ✕
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3 flex-1 overflow-auto">
        <div>
          <label htmlFor="prop-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="prop-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="prop-designer" className="block text-sm font-medium text-gray-700 mb-1">
            Designer
          </label>
          <select
            id="prop-designer"
            value={designerId}
            onChange={(e) => setDesignerId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            {designers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.fullName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="prop-size" className="block text-sm font-medium text-gray-700 mb-1">
            Size
          </label>
          <select
            id="prop-size"
            value={size}
            onChange={(e) => setSize(e.target.value as ObjectSize)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            {SIZE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="prop-color" className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <input
            id="prop-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded cursor-pointer"
          />
        </div>
        <div className="mt-auto pt-2 flex flex-col gap-2">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
          >
            Save changes
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete "${object.name}"?`)) {
                onDelete(object.id);
                onClose();
              }
            }}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500"
          >
            Delete object
          </button>
        </div>
      </form>
    </div>
  );
}
