import { rate360Api } from '@/shared/api/rate360Api';
import { universalApi } from '@/shared/api/universalApi';
import { usersApi } from '@/shared/api/usersApi';
import { Avatar } from '@/shared/ui/Avatar';
import { SoftButton } from '@/shared/ui/SoftButton';
import { FC, useRef } from 'react';
import { useParams } from 'react-router';
import ProgressBarBlock from './ProgressBarBlock';
import { cva } from '@/shared/lib/cva';
import { dateFormatter } from './helpers';
import { useCalculateAvgIndicatorRaitings } from './useCalculateAvgIndicatorRaitings';
import { useAggregatedAverages } from './useAggregatedAverages';
import { Competency, CompetencyBlock } from '@/entities/skill';
import WorkSpace from './WorkSpace';
import AyeChart from './ayeChart';
import CommentItem from './comments/CommentItem';
import { teamsApi } from '@/shared/api/teamsApi';
import { useAppSelector } from '@/app';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';

const evaluatorTypes = [
  'CURATOR',
  'TEAM_MEMBER',
  'SUBORDINATE',
  'SELF',
] as const;
const commonHeaders = [
  'Руководители',
  'Коллеги',
  'Подчиненные',
  'Самооц.',
] as const;

const RateCell = ({
  rate,
  boundary = 3,
}: {
  rate?: number;
  boundary?: number;
}) => {
  if (!rate) return <td className="px-3 py-4 text-sm">N/D</td>;

  const color =
    rate > boundary
      ? 'text-green-500'
      : rate === boundary
        ? 'text-black'
        : 'text-red-500';
  return (
    <td className={`whitespace-nowrap px-3 py-4 text-sm ${color}`}>
      {rate.toFixed(2)}
    </td>
  );
};

const Report360: FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = rate360Api.useGetRatesQuery();
  const rate = data?.find((report) => report.id === Number(id));
  const userRates = rate?.userRates;

  const { data: teams, isFetching: teamsFetching } =
    teamsApi.useGetTeamsQuery();

  const { data: users, isFetching: usersFetching } = usersApi.useGetUsersQuery(
    {},
  );
  const { data: specs, isFetching: specsFetching } =
    universalApi.useGetSpecsQuery();

  const skills = rate?.competencyBlocks;

  const foundSpec = specs?.find((spec) => spec.id === rate?.spec?.id);

  const curator = teams?.list.find((team) => team.id === rate?.teamId)?.curator;
  const foundUser = users?.users.find((user) => user.id === rate?.user?.id);

  const { avatar, firstName, lastName, id: userId } = foundUser || {};

  const indicatorRatings = useCalculateAvgIndicatorRaitings(
    rate?.evaluators,
    userRates,
    userId,
  );

  const ref = useRef<HTMLDivElement>(null);
  const currentUser = useAppSelector((state) => state.user.user);
  const isAdmin = currentUser?.role?.name === 'admin';

  const neededIndicatorIdsSet = new Set(
    userRates?.map((rate) => rate.indicatorId),
  );

  // TODO: replace loading

  // Фильтрация скиллов по индикатору типу и id
  const filteredBlocksCompetencies = foundSpec?.competencyBlocks
    ?.map((block) => {
      const skill = skills?.find(
        (skill) => skill.id === block.id && skill.type === rate?.type,
      );

      if (!skill) return null;

      const filteredCompetencies = skill.competencies
        .map((competency) => {
          const filteredIndicators = competency.indicators.filter((indicator) =>
            neededIndicatorIdsSet.has(indicator.id),
          );

          return filteredIndicators.length > 0
            ? { ...competency, indicators: filteredIndicators }
            : null;
        })
        .filter((competency): competency is Competency => competency !== null);

      return filteredCompetencies.length > 0
        ? { ...skill, competencies: filteredCompetencies.filter(Boolean) }
        : null;
    })
    .filter(Boolean) as CompetencyBlock[];

  const { overallAverage, blocksRaiting, competenciesRaiting } =
    useAggregatedAverages(filteredBlocksCompetencies, indicatorRatings);

  const onClickExport = () => {
    console.log('innerHTML => ', ref?.current?.innerHTML);
  };

  return (
    <LoadingOverlay
      active={isLoading || usersFetching || specsFetching || teamsFetching}
    >
      <div className="h-full">
        <div className="mt-16 mb-5 flex items-center justify-between px-5">
          <h1 className="text-sm font-bold tracking-tight text-gray-900">
            Просмотр отчёта
          </h1>
          <SoftButton onClick={onClickExport}>Экспорт</SoftButton>
        </div>
        <div className="p-5 overflow-x-auto" ref={ref}>
          <div className="p-5 min-w-[1100px]">
            <div>
              <h2 className="mt-2 text-sm font-semibold tracking-tight text-pretty text-gray-900">
                Отчет 360
              </h2>
            </div>
            <div className="flex gap-5 mt-10 items-center">
              <Avatar src={avatar} className="size-10" />
              <div>
                <p className="text-indigo-400 text-sm">{`${firstName} ${lastName}`}</p>
                <p className="text-sm">{`${foundSpec?.name} (${rate?.type})`}</p>
              </div>
            </div>

            <p className="text-right">{dateFormatter(rate?.startDate)}</p>
            {isAdmin && <WorkSpace user={foundUser} />}
            <div>
              <ProgressBarBlock />
              <div className="mt-16">
                {filteredBlocksCompetencies?.map((blocksCompetencies) => {
                  return (
                    <div
                      className="mb-16 last:mb-0"
                      key={blocksCompetencies?.id}
                    >
                      <h2 className="text-2xl mb-5">
                        {blocksCompetencies?.name}
                      </h2>
                      {blocksCompetencies?.competencies?.map((competency) => {
                        const competencyComments = rate?.comments.filter(
                          (comment) => comment.competencyId === competency.id,
                        );

                        return (
                          <div
                            key={blocksCompetencies?.id}
                            className="mb-6 last:mb-0"
                          >
                            <div
                              className={cva(
                                'overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg',
                              )}
                            >
                              <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                  <tr>
                                    {[
                                      'Компетенция/Индикатор',
                                      ...commonHeaders,
                                    ].map((header) => (
                                      <th
                                        key={header}
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                      >
                                        {header}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="w-full px-3 py-4 text-sm">
                                      {competency?.name}
                                    </td>
                                    {evaluatorTypes.map((evaluatorType) => (
                                      <RateCell
                                        key={evaluatorType}
                                        rate={
                                          competenciesRaiting?.[
                                            competency?.id
                                          ]?.[
                                            evaluatorType as keyof (typeof competenciesRaiting)[typeof competency.id]
                                          ]
                                        }
                                      />
                                    ))}
                                  </tr>
                                  {competency?.indicators?.map((indicator) => {
                                    return (
                                      <tr key={indicator.id}>
                                        <td className="w-full px-3 py-4 text-sm">
                                          {indicator.name}
                                        </td>
                                        {evaluatorTypes.map((evaluatorType) => (
                                          <RateCell
                                            boundary={indicator.boundary}
                                            key={evaluatorType}
                                            rate={
                                              indicatorRatings?.[
                                                indicator?.id
                                              ]?.[
                                                evaluatorType as keyof (typeof indicatorRatings)[typeof indicator.id]
                                              ]
                                            }
                                          />
                                        ))}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                            {isAdmin &&
                              (competencyComments?.length ?? 0) > 0 && (
                                <div className="mt-6 pl-5">
                                  <h3>
                                    <span className="text-black font-semibold">
                                      Комментарии к компетенции:
                                    </span>
                                    <span className="text-gray-900 ml-2">
                                      {competency?.name}
                                    </span>
                                  </h3>
                                  <div className="pl-3">
                                    {competencyComments?.map((comment) => (
                                      <CommentItem
                                        key={comment.id}
                                        user={users?.users.find(
                                          (user) => user.id === comment.userId,
                                        )}
                                        comment={comment.comment}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        );
                      })}
                      <div
                        className={cva(
                          'overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mt-6',
                        )}
                      >
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-50">
                            <tr>
                              {['Блок компетенции', ...commonHeaders].map(
                                (header) => (
                                  <th
                                    key={header}
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                  >
                                    {header}
                                  </th>
                                ),
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="w-full px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                {blocksCompetencies?.name}
                              </td>
                              {evaluatorTypes.map((evaluatorType) => (
                                <RateCell
                                  key={evaluatorType}
                                  rate={
                                    blocksRaiting?.[blocksCompetencies?.id]?.[
                                      evaluatorType as keyof (typeof blocksRaiting)[typeof blocksCompetencies.id]
                                    ]
                                  }
                                />
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div
                className={cva(
                  'overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mt-10',
                )}
              >
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Общая оценка', ...commonHeaders].map((header) => (
                        <th
                          key={header}
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="w-full px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Общая оценка
                      </td>
                      {evaluatorTypes.map((evaluatorType) => (
                        <RateCell
                          key={evaluatorType}
                          rate={
                            overallAverage?.[
                              evaluatorType as keyof typeof overallAverage
                            ]
                          }
                        />
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <AyeChart data={overallAverage} label={foundSpec?.name} />
            {isAdmin && (rate?.userComment || rate?.curatorComment) && (
              <>
                <h2 className="text-2xl mt-10">Комментарии</h2>
                <div className="pl-3">
                  {rate?.curatorComment && (
                    <CommentItem
                      user={curator}
                      comment={rate?.curatorComment}
                    />
                  )}
                  {rate?.userComment && (
                    <CommentItem user={foundUser} comment={rate?.userComment} />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default Report360;
