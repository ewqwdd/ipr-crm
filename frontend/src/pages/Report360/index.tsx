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
import { dateFormatter, useIndicatorRatings } from './helpers';
import Dimmer from '@/shared/ui/Dimmer';

// 3 - Curator
// 1,2 - teamMembers

// 11 12 13 14
const userRates = [
  {
    id: 1,
    userId: 1,
    rate360Id: 1,
    rate: 1,
    indicatorId: 13,
    approved: false,
  },
  {
    id: 1,
    userId: 1,
    rate360Id: 1,
    rate: 4,
    indicatorId: 13,
    approved: false,
  },
  {
    id: 1,
    userId: 3,
    rate360Id: 1,
    rate: 4,
    indicatorId: 13,
    approved: false,
  },
  {
    id: 1,
    userId: 3,
    rate360Id: 1,
    rate: 2,
    indicatorId: 13,
    approved: false,
  },
  {
    id: 1,
    userId: 2,
    rate360Id: 1,
    rate: 1,
    indicatorId: 12,
    approved: false,
  },
  {
    id: 1,
    userId: 3,
    rate360Id: 1,
    rate: 1,
    indicatorId: 11,
    approved: false,
  },
  {
    id: 1,
    userId: 2,
    rate360Id: 1,
    rate: 3,
    indicatorId: 11,
    approved: false,
  },
];

const evaluatorTypes = ['CURATOR', 'TEAM_MEMBER', 'SUBORDINATE'];

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
  const ref = useRef<HTMLDivElement>(null);

  const { data, isLoading } = rate360Api.useGetRatesQuery();

  const rate = data?.find((report) => report.id === Number(id));
  const indicatorRatings = useIndicatorRatings(rate?.evaluators, userRates);
  console.log('indicatorRatings => ', indicatorRatings);
  const { data: users, isFetching: usersFetching } = usersApi.useGetUsersQuery(
    {},
  );
  const { data: specs, isFetching: specsFetching } =
    universalApi.useGetSpecsQuery();

  const { data: skills, isFetching: skillsFetching } =
    skillsApi.useGetSkillsQuery();

  const foundSpec = specs?.find((spec) => spec.id === rate?.spec?.id);
  const foundUser = users?.users.find((user) => user.id === rate?.user?.id);

  const neededIndicatorIdsSet = new Set(
    userRates.map((rate) => rate.indicatorId),
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
        .filter(Boolean);

      return filteredCompetencies.length > 0
        ? { ...skill, competencies: filteredCompetencies }
        : null;
    })
    .filter(Boolean);

  const { avatar, firstName, lastName } = foundUser || {};

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
            <div>
              <p className="mt-6 text-sm text-gray-700">
                Отчет отображает результаты, полученные при прохождении оценки
                по методу 360/180 градусов. Результаты оценки 360 градусов
                базируются на мнениях руководителя, коллег, подчиненных, а также
                на самооценке самого участника команды. В небольших командах
                некоторые из ролей оценивающих могут отсутствовать. Цель отчета
                — дать участнику команды и его окружению обратную связь, помочь
                оцениваемому понять,как его воспринимают со стороны, увидеть
                свои сильные и слабые стороны, чтобы в результате усилить слабые
                стороны или более уверенно пользоваться своими сильными
                сторонами. Результаты оценки помогают подготовить планы для
                развития сотрудника,повысить эффективность взаимодействия за
                счет комплексной обратной связи.
              </p>
            </div>
            <div>
              <ProgressBarBlock />
              <div className="mt-16">
                {filteredBlocksCompetencies?.map((blocksCompetencies) => {
                  return (
                    <div
                      className="mb-16 last:mb-0"
                      key={blocksCompetencies?.id}
                    >
                      <h2 className="text-2xl font-bold mb-10">
                        {/* Block Competencies:  */}
                        {blocksCompetencies?.name}
                      </h2>
                      {blocksCompetencies?.competencies?.map((competency) => {
                        return (
                          <div
                            key={blocksCompetencies?.id}
                            className="mb-12 last:mb-0"
                          >
                            <h3 className="text-lg font-semibold mb-5">
                              {/* Competency:  */}
                              {competency?.name}
                            </h3>
                            <div
                              className={cva(
                                'overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg',
                              )}
                            >
                              <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                      Индикатор
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                      Руководители
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                      Коллеги
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                      Подчиненные
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {competency?.indicators?.map((indicator) => {
                                    return (
                                      <tr key={indicator.id}>
                                        <td className="w-full px-3 py-4 text-sm">
                                          {indicator.name}
                                        </td>
                                        {evaluatorTypes.map((evaluatorType) => (
                                          <RateCell
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
                    </div>
                  );
                })}
              </div>
              <div>
                <h4 className="">{''}</h4>
              </div>
              <div>
                <h4 className="">{''}</h4>
              </div>
            </div>
          </div>
        </div>
      </Dimmer>
    </div>
  );
};

export default Report360;
