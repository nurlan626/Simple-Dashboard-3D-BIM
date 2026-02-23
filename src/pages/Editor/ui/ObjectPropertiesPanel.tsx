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

  const inputClass =
    'w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 transition-colors';
  const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700';

  return (
    <div className="flex w-80 shrink-0 flex-col h-full bg-white border-l border-slate-200 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="font-semibold text-slate-800">Object properties</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500"
          aria-label="Close panel"
        >
          <span className="text-lg leading-none">×</span>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 overflow-auto p-4">
        <div>
          <label htmlFor="prop-name" className={labelClass}>Name</label>
          <input
            id="prop-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="mt-1.5 text-sm text-red-600" role="alert">{errors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="prop-designer" className={labelClass}>Designer</label>
          <select id="prop-designer" value={designerId} onChange={(e) => setDesignerId(e.target.value)} className={inputClass}>
            {designers.map((d) => (
              <option key={d.id} value={d.id}>{d.fullName}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="prop-size" className={labelClass}>Size</label>
          <select
            id="prop-size"
            value={size}
            onChange={(e) => setSize(e.target.value as ObjectSize)}
            className={inputClass}
          >
            {SIZE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="prop-color" className={labelClass}>Color</label>
          <input
            id="prop-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-300 cursor-pointer bg-white p-1"
          />
        </div>
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <button
            type="submit"
            className="w-full rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
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
            className="w-full rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Delete object
          </button>
        </div>
      </form>
    </div>
  );
}
