import { useEffect, useState } from 'react';
import { Heading } from '@/shared/ui/Heading';
import Specializations from './specializations';
import Competency from './competency';
import { Tabs } from '@/shared/ui/Tabs';
import { skillsApi } from '@/shared/api/skillsApi';
import toast from 'react-hot-toast';
import { rate360Api } from '@/shared/api/rate360Api';
import { universalApi } from '@/shared/api/universalApi';
import { useAppDispatch } from '@/app';
import FoldersWrapper from './folders/FoldersWrapper';
import { foldersApi } from '@/shared/api/foldersApi';

const tabs = [
  { name: 'Компетенции', key: 'COMPETENCY' },
  { name: 'Специализации', key: 'SPECIALIZATIONS' },
  { name: 'Папки', key: 'FOLDERS' },
];

export default function Skills() {
  const [tab, setTab] = useState(tabs[0]);
  const dispatch = useAppDispatch();

  const setTabWrapper = (tab: string) => {
    setTab((s) => tabs.find((t) => t.key === tab) || s);
  };
  const archiveMutation = skillsApi.useArchiveAllMutation();

  useEffect(() => {
    if (archiveMutation[1].isSuccess) {
      toast.success('Версия зафиксирована');
      console.log('Версия зафиксирована');
      dispatch(rate360Api.util.invalidateTags(['Rate360']));
      dispatch(universalApi.util.invalidateTags(['Spec']));
      dispatch(
        foldersApi.util.invalidateTags([
          'ProductFolders',
          'TeamFolders',
          'SpecFolders',
        ]),
      );
    }
  }, [archiveMutation[1].isSuccess, dispatch]);

  return (
    <>
      <div className="sm:px-8 sm:py-10 px-4 py-6 flex flex-col sm:h-full">
        <div className="flex max-sm:flex-col-reverse max-sm:gap-2">
          <Heading title="Конструктор профилей" description={tab.name} />
          <div className="space-x-2 max-sm:pr-12">
            <Tabs
              tabs={tabs}
              currentTab={tab.key}
              setCurrentTab={setTabWrapper}
            />
          </div>
        </div>
        {tab.key === 'COMPETENCY' && (
          <Competency archiveMutation={archiveMutation} />
        )}
        {tab.key === 'SPECIALIZATIONS' && (
          <Specializations archiveMutation={archiveMutation} />
        )}
        {tab.key === 'FOLDERS' && <FoldersWrapper />}
      </div>
    </>
  );
}
