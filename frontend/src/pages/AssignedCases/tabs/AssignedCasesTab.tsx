import { CaseRate } from '@/entities/cases';
import { useMemo } from 'react';
import AssignedCaseItem from './AssignedCaseItem';
import { useAppSelector } from '@/app';

interface AssignedProps {
  cases: CaseRate[];
}

export default function AssignedCasesTab({ cases }: AssignedProps) {
  const userId = useAppSelector((state) => state.user.user?.id);
  const assigned = useMemo(() => {
    return cases.filter(
      (caseItem) =>
        !caseItem.finished &&
        !(
          caseItem.userRates.filter((rate) => rate.userId === userId).length >=
          caseItem.cases.length
        ),
    );
  }, [cases, userId]);

  return (
    <div className="flex flex-col gap-2">
      {assigned.map((caseItem) => (
        <AssignedCaseItem key={caseItem.id} caseItem={caseItem} />
      ))}
    </div>
  );
}
