import type { Designer } from '../model/types';
import { DesignerCard } from './DesignerCard';

interface DesignerListProps {
  designers: Designer[];
}

export const DesignerList = ({ designers }: DesignerListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {designers.map((d) => (
        <DesignerCard key={d.id} designer={d} />
      ))}
    </div>
  );
};
