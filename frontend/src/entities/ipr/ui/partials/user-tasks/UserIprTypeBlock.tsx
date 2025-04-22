import { Ipr, TaskType } from '@/entities/ipr/model/types';
import { memo } from 'react';
import UserIprMaterialsBlock from './UserIprMaterialsBlock';

interface UserIprTypeBlockProps {
  ipr: Ipr;
  type: TaskType;
}

export default memo(function UserIprTypeBlock({
  ipr,
  type,
}: UserIprTypeBlockProps) {
  const filtereedByType = ipr.tasks.filter((task) => task.type === type);

  const allCompetencies = Array.from(
    new Map(
      filtereedByType.map((task) => [task.competency?.id, task.competency]),
    ).values(),
  );
  const allIndicators = Array.from(
    new Map(
      filtereedByType.map((task) => [task.indicator?.id, task.indicator]),
    ).values(),
  );

  if (type === 'GENERAL') {
    return allCompetencies.map((competency) => (
      <UserIprMaterialsBlock
        iprId={ipr.id}
        key={competency?.id ?? -1}
        tasks={filtereedByType}
        competency={competency}
      />
    ));
  } else {
    return allIndicators.map((indicator) => (
      <UserIprMaterialsBlock
        iprId={ipr.id}
        key={indicator?.id ?? -1}
        tasks={filtereedByType}
        indicator={indicator}
      />
    ));
  }
});
