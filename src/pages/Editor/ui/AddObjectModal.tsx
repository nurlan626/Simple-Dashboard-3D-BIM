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

  const inputClass =
    'w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 transition-colors';
  const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700';

  return (
    <ModalWindow isOpen={isOpen} onClose={onClose} title="Add object">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="add-obj-name" className={labelClass}>Name</label>
          <input
            id="add-obj-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Object name"
            className={inputClass}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'add-obj-name-error' : undefined}
          />
          {errors.name && (
            <p id="add-obj-name-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="add-obj-designer" className={labelClass}>Designer</label>
          <select
            id="add-obj-designer"
            value={designerId}
            onChange={(e) => setDesignerId(e.target.value)}
            className={inputClass}
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
            <p id="add-obj-designer-error" className="mt-1.5 text-sm text-red-600" role="alert">
              {errors.designer}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="add-obj-size" className={labelClass}>Size</label>
          <select
            id="add-obj-size"
            value={size}
            onChange={(e) => setSize(e.target.value as ObjectSize)}
            className={inputClass}
          >
            {SIZE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="add-obj-color" className={labelClass}>Color</label>
          <input
            id="add-obj-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-300 cursor-pointer bg-white p-1"
          />
        </div>
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
          >
            Add object
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </ModalWindow>
  );
}
