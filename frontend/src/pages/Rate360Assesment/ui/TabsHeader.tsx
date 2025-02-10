import { CompetencyBlock } from '@/entities/skill';
import { Tabs } from '@/shared/ui/Tabs';
import { useSearchParams } from 'react-router';

interface TabsHeaderProps {
  blocks: CompetencyBlock[];
}

export default function TabsHeader({ blocks }: TabsHeaderProps) {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const setTab = (id: string) => setUrlSearchParams(`?tab=${id}`);
  const tab = urlSearchParams.get('tab');
  const tabs = blocks
    .filter((block) =>
      block.competencies.some((comp) => comp.indicators.length > 0),
    )
    .map((block) => ({
      name: block.name,
      key: block.id.toString(),
    }));

  if (blocks.length === 0) return null;

  return (
    <Tabs
      currentTab={tab ?? tabs[0].key}
      setCurrentTab={setTab}
      tabs={tabs}
      tabClassName="first:ml-4"
    />
  );
}
