import { useState } from 'react';
import { Heading } from '@/shared/ui/Heading';
import Specializations from './specializations';
import Competency from './competency';
import { Tabs } from '@/shared/ui/Tabs';

const tabs = [
  { name: 'Компетенции', key: 'COMPETENCY' },
  { name: 'Специализации', key: 'SPECIALIZATIONS' },
];

export default function Skills() {
  const [tab, setTab] = useState(tabs[0]);

  const setTabWrapper = (tab: string) => {
    setTab((s) => tabs.find((t) => t.key === tab) || s);
  };

  return (
    <>
      <div className="px-8 py-10 flex flex-col h-full">
        <div className="flex">
          <Heading title="Конструктор профилей" description={tab.name} />
          <div className="space-x-2">
            <Tabs
              tabs={tabs}
              currentTab={tab.key}
              setCurrentTab={setTabWrapper}
            />
          </div>
        </div>
        {tab.key === 'COMPETENCY' && <Competency />}
        {tab.key === 'SPECIALIZATIONS' && <Specializations />}
      </div>
    </>
  );
}
