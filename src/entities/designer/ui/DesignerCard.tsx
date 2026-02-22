import { useDeleteDesignerMutation } from "../api/designerApi";
import type { Designer } from "../model/types";

interface DesignerCardProps {
  designer: Designer;
}

export const DesignerCard = ({ designer }: DesignerCardProps) => {
  const [deleteDesigner] = useDeleteDesignerMutation();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <h3 className="text-lg font-semibold text-slate-800">{designer.fullName}</h3>
      <dl className="mt-3 space-y-1 text-sm text-slate-600">
        <div className="flex justify-between">
          <dt className="text-slate-500">Working hours</dt>
          <dd>{designer.workingHours}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Attached objects</dt>
          <dd>{designer.attachedObjectsCount}</dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={() => deleteDesigner(designer.id)}
        className="mt-4 rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
      >
        Delete designer
      </button>
    </div>
  );
};
