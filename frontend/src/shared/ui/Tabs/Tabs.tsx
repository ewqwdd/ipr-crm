import { cva } from '@/shared/lib/cva';
import React, { memo } from 'react';

interface Tab {
  name: string;
  element?: React.ReactNode;
  key: string;
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: Tab[];
  currentTab?: string;
  setCurrentTab: (tab: string) => void;
  tabClassName?: string;
}

export default memo(function Tabs({
  tabs,
  currentTab,
  setCurrentTab,
  className,
  tabClassName,
  ...props
}: TabsProps) {
  return (
    <div className={className} {...props}>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          defaultValue={tabs.find((tab) => tab.key === currentTab)?.name}
          onChange={(e) => setCurrentTab(e.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab.key}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={cva(
                  'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all',
                  {
                    'border-indigo-500 text-indigo-600 hover:border-indigo-500 hover:text-indigo-500':
                      tab.key === currentTab,
                  },
                  tabClassName,
                )}
                onClick={() => setCurrentTab(tab.key)}
              >
                {tab.element ?? tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
});
