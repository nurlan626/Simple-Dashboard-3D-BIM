import { useState } from 'react';
import { useAddDesignerMutation } from '../../../entities/designer/api/designerApi';

interface AddDesignerFormProps {
  onSuccess?: () => void;
}

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 transition-colors';

export const AddDesignerForm = ({ onSuccess }: AddDesignerFormProps) => {
  const [fullName, setFullName] = useState('');
  const [workingHours, setWorkingHours] = useState(8);
  const [error, setError] = useState('');
  const [addDesigner] = useAddDesignerMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = fullName.trim();
    if (!trimmed) {
      setError('Name is required');
      return;
    }
    setError('');
    await addDesigner({ fullName: trimmed, workingHours });
    setFullName('');
    setWorkingHours(8);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="designer-name" className="mb-1.5 block text-sm font-medium text-slate-700">
          Full name
        </label>
        <input
          id="designer-name"
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={inputClass}
          required
        />
        {error && <p className="mt-1.5 text-sm text-red-600" role="alert">{error}</p>}
      </div>
      <div>
        <label htmlFor="designer-hours" className="mb-1.5 block text-sm font-medium text-slate-700">
          Working hours
        </label>
        <input
          id="designer-hours"
          type="number"
          placeholder="8"
          value={workingHours}
          onChange={(e) => setWorkingHours(Number(e.target.value))}
          className={inputClass}
          min={1}
          max={24}
          required
        />
      </div>
      <button
        type="submit"
        className="rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
      >
        Add
      </button>
    </form>
  );
};
