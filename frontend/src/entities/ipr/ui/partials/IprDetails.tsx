import { rateTypeNames } from '@/entities/rates';
import { Ipr } from '../../model/types';
import { Stat } from '@/shared/ui/Stat';

interface IprDetailsProps {
  ipr?: Ipr;
}

export default function IprDetails({ ipr }: IprDetailsProps) {
  return (
    <div className="grid sm:grid-cols-3 gap-6 pt-4">
      <Stat title="Специализация" value={ipr?.rate360.spec.name} />
      <Stat
        title="Версия"
        value={ipr?.version && new Date(ipr?.version).toLocaleDateString()}
      />
      <Stat
        title="Навыки"
        value={ipr?.skillType && rateTypeNames[ipr?.skillType]}
      />
    </div>
  );
}
