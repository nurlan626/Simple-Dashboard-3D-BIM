import { useState } from "react";
import { useGetDesignersQuery } from "../../../entities/designer/api/designerApi";
import { DesignerList } from "../../../entities/designer/ui/DesignerList";
import { AddDesignerForm } from "../../../features/addDesigner/ui/AddDesignerForm";
import ModalWindow from "../../../shared/ui/modalWindow/modalWIndow";

export const DesignersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: designers = [], isLoading } = useGetDesignersQuery();

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Designers</h1>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
        >
          Add designer
        </button>
      </div>

      <ModalWindow
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add designer"
      >
        <AddDesignerForm onSuccess={() => setIsModalOpen(false)} />
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
      </ModalWindow>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
        </div>
      ) : (
        <DesignerList designers={designers} />
      )}
    </div>
  );
};
