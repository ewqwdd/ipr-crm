import { useState } from 'react';
import SpecsTab from './SpecsTab/SpecsTab';
import EvaluatorsTab from './EvaluatorsTab/EvaluatorsTab';
import { Rate } from '../../types/types';

export type TabType = 'specs' | 'evaluators';

interface AddRateProps {
  closeModal?: () => void;
}

export default function AddRate({ closeModal }: AddRateProps) {
  const [tab, setTab] = useState<TabType>('specs');
  const [skillTypes, setSkillTypes] = useState<string[]>([]);
  const [rateType, setRateType] = useState<Rate['rateType']>('Rate360');

  const onClose = () => {
    if (closeModal) {
      closeModal();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {tab === 'specs' && (
        <SpecsTab
          skillTypes={skillTypes}
          setSkillTypes={setSkillTypes}
          setTab={setTab}
          rateType={rateType}
          setRateType={setRateType}
        />
      )}
      {tab === 'evaluators' && (
        <EvaluatorsTab
          closeModal={onClose}
          skillTypes={skillTypes}
          setTab={setTab}
          rateType={rateType}
        />
      )}
    </div>
  );
}
