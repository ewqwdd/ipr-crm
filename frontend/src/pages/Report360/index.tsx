import { rate360Api } from '@/shared/api/rate360Api';
import { universalApi } from '@/shared/api/universalApi';
import { usersApi } from '@/shared/api/usersApi';
import { Avatar } from '@/shared/ui/Avatar';
import { SoftButton } from '@/shared/ui/SoftButton';
import { FC, useRef } from 'react';
import { useParams } from 'react-router';
import ProgressBarBlock from './ProgressBarBlock';
import { skillsApi } from '@/shared/api/skillsApi';
import { cva } from '@/shared/lib/cva';
import { dateFormatter } from './helpers';
import Dimmer from '@/shared/ui/Dimmer';
import { useCalculateAvgIndicatorRaitings } from './useCalculateAvgIndicatorRaitings';
import { useAggregatedAverages } from './useAggregatedAverages';
import { Competency, CompetencyBlock } from '@/entities/skill';
import WorkSpace from './WorkSpace';
import AyeChart from './ayeChart';

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

const RateCell = ({ rate }: { rate?: number }) => {
  if (!rate) return <td className="px-3 py-4 text-sm">N/D</td>;

  const color =
    rate > 3 ? 'text-green-500' : rate > 2 ? 'text-black' : 'text-red-500';
  return (
    <td className={`whitespace-nowrap px-3 py-4 text-sm ${color}`}>{rate}</td>
  );
};

const Report360: FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = rate360Api.useGetRatesQuery();

  const rate = data?.find((report) => report.id === Number(id));
  const userRates = rate?.userRates;

  const { data: users, isFetching: usersFetching } = usersApi.useGetUsersQuery(
    {},
  );
  const { data: specs, isFetching: specsFetching } =
    universalApi.useGetSpecsQuery();

  const { data: skills, isFetching: skillsFetching } =
    skillsApi.useGetSkillsQuery();

  const foundSpec = specs?.find((spec) => spec.id === rate?.spec?.id);
  const foundUser = users?.users.find((user) => user.id === rate?.user?.id);

  const { avatar, firstName, lastName, role, id: userId } = foundUser || {};

  const indicatorRatings = useCalculateAvgIndicatorRaitings(
    rate?.evaluators,
    userRates,
    userId,
  );

  const ref = useRef<HTMLDivElement>(null);
  const isAdmin = role?.name === 'admin';

  const neededIndicatorIdsSet = new Set(
    userRates?.map((rate) => rate.indicatorId),
  );

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
    <div className="h-full">
      <Dimmer
        active={isLoading || usersFetching || specsFetching || skillsFetching}
      >
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
                        return (
                          <div
                            key={blocksCompetencies?.id}
                            className="mb-4 last:mb-0"
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
                          </div>
                        );
                      })}
                      <div
                        className={cva(
                          'overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mt-5',
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
          </div>
        </div>
      </Dimmer>
    </div>
  );
};

export default Report360;
