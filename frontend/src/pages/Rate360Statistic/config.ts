type TabKeys = 'confirmations' | 'evaluators_progress';

export const rate360StatistcTabs: { name: string; key: TabKeys }[] = [
  {
    key: 'confirmations',
    name: 'Неутвердившие список',
  },
  {
    key: 'evaluators_progress',
    name: 'Прогресс оценивающих',
  },
];

export const STATISTIC_LIMIT = 8;
