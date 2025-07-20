type TabKeys = 'confirmations' | 'evaluators_progress';

export const rate360StatistcTabs: { name: string; key: TabKeys }[] = [
  {
    key: 'confirmations',
    name: 'Неутвердившие список',
  },
  {
    key: 'evaluators_progress',
    name: 'Прогресс оцениваниющих',
  },
];

export const STATISTIC_LIMIT = 8;
