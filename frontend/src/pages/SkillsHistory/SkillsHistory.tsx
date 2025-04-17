import { skillsApi } from '@/shared/api/skillsApi';
import { Heading } from '@/shared/ui/Heading';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { ArrowRightIcon } from '@heroicons/react/outline';
import { Link } from 'react-router';

export default function SkillsHistory() {
  const { data, isFetching } = skillsApi.useGetVersionsQuery();
  // TODO: replace loading

  return (
    <LoadingOverlay active={isFetching}>
      <div className={'px-8 py-10 flex flex-col'}>
        <Heading
          title="Версии профилей"
          description="История версий профилей"
        />

        <div className="flex flex-col max-w-3xl mt-10">
          {data?.map((item) => (
            <Link
              to={`/skills/history/${item.id}`}
              key={item.id}
              className="flex group py-4 px-6 border-b border-gray-200 hover:bg-gray-50 transition-all"
            >
              <span className="group-hover:text-blue-500 text-lg font-medium text-gray-800 transition-all flex-1">
                {item.date.toDateString()}
              </span>
              <ArrowRightIcon className="h-6 w-6 text-gray-500 group-hover:text-blue-500 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </LoadingOverlay>
  );
}
