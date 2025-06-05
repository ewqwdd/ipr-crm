import { surveyApi } from '@/shared/api/surveyApi';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { Tabs } from '@/shared/ui/Tabs';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import GeneralTab from './ui/GeneralTab/GeneralTab';
import UsersTab from './ui/UsersTab/UsersTab';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';

export default function SurvyeResult() {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const setTab = (id: string) => setUrlSearchParams(`?tab=${id}`);
  const tab = urlSearchParams.get('tab') ?? 'general';
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = surveyApi.useGetResultByIdQuery(parseInt(id!), {
    skip: !id || Number.isNaN(parseInt(id)),
  });

  return (
    <LoadingOverlay active={isLoading} fullScereen>
      <div className="sm:px-8 sm:py-10 py-3 flex flex-col h-full relative">
        <div className='flex items-center justify-between'>
          <Heading title={data?.name} />
          <SecondaryButton onClick={() => navigate('/surveys')}>
            Назад
          </SecondaryButton>
        </div>
        <Tabs
          tabs={[
            {
              key: 'general',
              name: 'Сводка',
            },
            { key: 'users', name: 'По отдельным пользователям' },
          ]}
          setCurrentTab={setTab}
          currentTab={tab}
        />
        {tab === 'general' && <GeneralTab survey={data} />}
        {tab === 'users' && <UsersTab survey={data} />}
      </div>
    </LoadingOverlay>
  );
}
