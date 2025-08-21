import { CaseRate } from '@/entities/cases';
import { CaseRateItemDto } from '@/entities/cases/types/types';
import { cva } from '@/shared/lib/cva';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { TextArea } from '@/shared/ui/TextArea';
import { useRef, useState } from 'react';

interface AssignedCaseProgressProps {
  assignedCase: CaseRate;
  onSubmit: (rates: CaseRateItemDto[], globalComment?: string) => void;
  loading?: boolean;
}

export default function AssignedCaseProgress({
  assignedCase,
  onSubmit,
  loading,
}: AssignedCaseProgressProps) {
  const globalCommentRef = useRef<HTMLTextAreaElement>(null);
  const [rates, setRates] = useState<Partial<CaseRateItemDto>[]>(() => {
    try {
      const saved = localStorage.getItem(window.location.pathname);
      if (!saved) return [];
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  const handleChangeVariant = (caseId: number, rate: number) => {
    const found = rates.find((r) => r.caseId === caseId);
    if (!found) {
      setRates([...rates, { caseId, rate }]);
      localStorage.setItem(
        window.location.pathname,
        JSON.stringify([...rates, { caseId, rate }]),
      );
      return;
    }
    const newRates = rates.map((r) => {
      if (r.caseId === caseId) {
        return { ...r, rate };
      }
      return r;
    });
    setRates(newRates);
    localStorage.setItem(window.location.pathname, JSON.stringify(newRates));
  };

  const handleChangeComment = (caseId: number, comment: string) => {
    const found = rates.find((r) => r.caseId === caseId);
    if (!found) {
      setRates([...rates, { caseId, comment }]);
      localStorage.setItem(
        window.location.pathname,
        JSON.stringify([...rates, { caseId, comment }]),
      );
      return;
    }
    const newRates = rates.map((r) => {
      if (r.caseId === caseId) {
        return { ...r, comment };
      }
      return r;
    });
    setRates(newRates);
    localStorage.setItem(window.location.pathname, JSON.stringify(newRates));
  };

  const isFinished = assignedCase.cases.every(
    (c) => !!rates.find((r) => r.caseId === c.id && r.rate !== undefined),
  );

  const handleSubmit = () => {
    if (!isFinished) return;
    onSubmit(rates as CaseRateItemDto[], globalCommentRef.current?.value);
    localStorage.removeItem(window.location.pathname);
  };

  return (
    <div
      className={cva('flex flex-col', {
        'animate-pulse pointer-events-none': !!loading,
      })}
    >
      {assignedCase.cases.map((c, i) => (
        <div
          key={c.id}
          className="flex flex-col py-4 sm:py-8 border-b-gray-200 border-b"
          style={{
            border: i === assignedCase.cases.length - 1 ? 'none' : undefined,
          }}
        >
          <h2 className="text-lg font-semibold">{c.name}</h2>
          <p className="text-gray-500">{c.description}</p>
          <div
            style={{
              gridTemplateColumns: `repeat(${c.variants.length}, 1fr)`,
            }}
            className="grid gap-1 max-sm:!grid-cols-2 max-[420px]:!grid-cols-1 mt-3 mb-1"
          >
            {c.variants.map((v) => (
              <SecondaryButton
                onClick={() => handleChangeVariant(v.caseId, v.value)}
                className={cva('size-full', {
                  'bg-green-100 hover:bg-green-100':
                    v.value === rates.find((r) => r.caseId === v.caseId)?.rate,
                })}
              >
                {v.name}
              </SecondaryButton>
            ))}
          </div>
          {c.commentEnabled && (
            <TextArea
              label="Комментарий"
              value={rates.find((r) => r.caseId === c.id)?.comment || ''}
              onChange={(e) => handleChangeComment(c.id, e.target.value)}
            />
          )}
        </div>
      ))}
      {assignedCase.globalCommentsEnabled && (
        <div className="pt-8 border-b border-gray-200">
          <TextArea label="Общий комментарий" ref={globalCommentRef} />
        </div>
      )}

      <PrimaryButton
        disabled={!isFinished}
        className="self-end mt-4"
        onClick={handleSubmit}
      >
        Завершить
      </PrimaryButton>
    </div>
  );
}
