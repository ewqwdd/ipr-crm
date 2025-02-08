import { useState } from 'react';
import EvaluatorsTab from './EvaluatorsTab/EvaluatorsTab';

export type TabType = 'specs' | 'evaluators';

export default function AddRate() {
  const [tab, setTab] = useState<TabType>('specs');

  return (
    <div className="flex flex-col gap-2">
      {tab === 'specs' && <EvaluatorsTab setTab={setTab} />}
    </div>
  );
}
