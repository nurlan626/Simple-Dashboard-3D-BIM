import { useState } from 'react';
import type { Designer } from '../../../entities/designer/model/types';
import type { ObjectSize, SceneObject } from '../../../entities/object/model/types';
import ModalWindow from '../../../shared/ui/modalWindow/modalWIndow';

const SIZE_OPTIONS: { value: ObjectSize; label: string }[] = [
  { value: 'small', label: 'Small' },
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Large' },
];

const DEFAULT_COLOR = '#6b7280';

interface AddObjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  designers: Designer[];
  position: { x: number; y: number; z: number };
  onSubmit: (data: Omit<SceneObject, 'id'>) => void;
}

export function AddObjectModal({
  isOpen,
  onClose,
  designers,
  position,
  onSubmit,
}: AddObjectModalProps) {
  const [name, setName] = useState('');
  const [designerId, setDesignerId] = useState('');
  const [size, setSize] = useState<ObjectSize>('normal');
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [errors, setErrors] = useState<{ name?: string; designer?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { name?: string; designer?: string } = {};
    const trimmedName = name.trim();
    if (!trimmedName) nextErrors.name = 'Name is required';
    if (!designerId) nextErrors.designer = 'Please select a designer';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      name: trimmedName,
      attachedDesignerId: designerId,
      color: color || DEFAULT_COLOR,
      position,
      size,
    });
    setName('');
    setDesignerId('');
    setSize('normal');
    setColor(DEFAULT_COLOR);
    setErrors({});
    onClose();
  };

  return (
    <ModalWindow isOpen={isOpen} onClose={onClose} title="Add object">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label htmlFor="add-obj-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="add-obj-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Object name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'add-obj-name-error' : undefined}
          />
          {errors.name && (
            <p id="add-obj-name-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="add-obj-designer" className="block text-sm font-medium text-gray-700 mb-1">
            Designer
          </label>
          <select
            id="add-obj-designer"
            value={designerId}
            onChange={(e) => setDesignerId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-invalid={!!errors.designer}
            aria-describedby={errors.designer ? 'add-obj-designer-error' : undefined}
          >
            <option value="">Select designer</option>
            {designers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.fullName}
              </option>
            ))}
          </select>
          {errors.designer && (
            <p id="add-obj-designer-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.designer}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="add-obj-size" className="block text-sm font-medium text-gray-700 mb-1">
            Size
          </label>
          <select
            id="add-obj-size"
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
          <label htmlFor="add-obj-color" className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <input
            id="add-obj-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded cursor-pointer"
          />
        </div>
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add object
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </ModalWindow>
  );
}
