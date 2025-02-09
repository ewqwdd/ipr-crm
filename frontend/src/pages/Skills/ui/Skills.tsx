import { useState } from 'react';
import { Heading } from '@/shared/ui/Heading';
import { SoftButton } from '@/shared/ui/SoftButton';
import { Specializations } from './specializations';
import Competency from './competency';

const tabs = [
  { title: 'Компетенции', label: 'Реестр компетенций', value: 'COMPETENCY' },
  { title: 'Специализации', label: 'Специализации', value: 'SPECIALIZATIONS' },
];

export default function Skills() {
  const [tab, setTab] = useState(tabs[0]);

  return (
    <>
      <div className="px-8 py-10 flex flex-col">
        <div className="flex">
          <Heading title="Конструктор профилей" description={tab.label} />
          <div className="space-x-2">
            {tabs.map((tabItem) => (
              <SoftButton
                key={tabItem.value}
                onClick={() => setTab(tabItem)}
                className={`${tab.value === tabItem.value ? 'bg-gray-200/80' : ''}`}
              >
                {tabItem.title}
              </SoftButton>
            ))}
          </div>
        </div>
        {tab.value === 'COMPETENCY' && <Competency />}
        {tab.value === 'SPECIALIZATIONS' && <Specializations />}
      </div>
    </>
  );
}
