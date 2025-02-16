import { Modal } from '@/shared/ui/Modal';
import {
  AddRateDto,
  EvaluateUser,
  EvaulatorType,
  Rate,
} from '../../types/types';
import { useEffect, useState } from 'react';
import { rateTypeNames } from '../../model/rateTypeNames';
import EvaluatorsList from './EvaluatorsList';
import EvaluatorsForm from '../EvaluatorsForm/EvaluatorsForm';
import ConfirmTitle from './ConfirmTitle';
import { rate360Api } from '@/shared/api/rate360Api';
import toast from 'react-hot-toast';

interface ConfirmEvaluatorsModalData {
  rate: Rate;
  curatorBlocked?: boolean;
}
interface ConfirmEvaluatorsModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

export default function ConfirmEvaluatorsModal({
  closeModal,
  isOpen,
  modalData,
}: ConfirmEvaluatorsModalProps) {
  const { rate, curatorBlocked } = modalData as ConfirmEvaluatorsModalData;
  const [selected, setSelected] = useState<EvaluateUser[]>([]);
  const [confirmCurator, curatorProps] =
    rate360Api.useConfirmRateByCuratorMutation();
  const [confirmUser, userProps] = rate360Api.useConfirmRateByUserMutation();

  const [addType, setAddType] = useState<EvaulatorType | undefined>();

  const onDelete = (userId: number) => {
    setSelectedSpecs((prev) => {
      let evaluateCurators = prev[0].specs[0].evaluateCurators;
      let evaluateTeam = prev[0].specs[0].evaluateTeam;
      let evaluateSubbordinate = prev[0].specs[0].evaluateSubbordinate;

      evaluateCurators = evaluateCurators.filter((e) => e.userId !== userId);
      evaluateTeam = evaluateTeam.filter((e) => e.userId !== userId);
      evaluateSubbordinate = evaluateSubbordinate.filter(
        (e) => e.userId !== userId,
      );

      return [
        {
          teamId: rate.teamId,
          specs: [
            {
              specId: rate.specId,
              userId: rate.userId,
              evaluateCurators,
              evaluateTeam,
              evaluateSubbordinate,
            },
          ],
        },
      ];
    });
  };

  const [selectedSpecs, setSelectedSpecs] = useState<AddRateDto[]>([
    {
      teamId: rate.teamId,
      specs: [
        {
          specId: rate.specId,
          userId: rate.userId,
          evaluateCurators: rate.evaluators
            .filter((e) => e.type === 'CURATOR')
            .map((e) => ({ userId: e.userId, username: e.user.username })),
          evaluateTeam: rate.evaluators
            .filter((e) => e.type === 'TEAM_MEMBER')
            .map((e) => ({ userId: e.userId, username: e.user.username })),
          evaluateSubbordinate: rate.evaluators
            .filter((e) => e.type === 'SUBORDINATE')
            .map((e) => ({ userId: e.userId, username: e.user.username })),
        },
      ],
    },
  ]);

  const onSubmit = (type: EvaulatorType) => {
    setSelectedSpecs((prev) => {
      let evaluateCurators = prev[0].specs[0].evaluateCurators;
      let evaluateTeam = prev[0].specs[0].evaluateTeam;
      let evaluateSubbordinate = prev[0].specs[0].evaluateSubbordinate;

      if (type === 'CURATOR') {
        evaluateCurators = selected;
      } else if (type === 'TEAM_MEMBER') {
        evaluateTeam = selected;
      } else if (type === 'SUBORDINATE') {
        evaluateSubbordinate = selected;
      }

      return [
        {
          teamId: rate.teamId,
          specs: [
            {
              specId: rate.specId,
              userId: rate.userId,
              evaluateCurators,
              evaluateTeam,
              evaluateSubbordinate,
            },
          ],
        },
      ];
    });
    setAddType(undefined);
  };

  const confirm = () => {
    const fn = curatorBlocked ? confirmUser : confirmCurator;
    const { evaluateCurators, evaluateSubbordinate, evaluateTeam } =
      selectedSpecs[0].specs[0];

    fn({
      rateId: rate.id,
      evaluateCurators,
      evaluateSubbordinate,
      evaluateTeam,
    });
  };

  useEffect(() => {
    if (curatorProps.isSuccess || userProps.isSuccess) {
      closeModal();
    }
  }, [curatorProps.isSuccess, userProps.isSuccess, closeModal]);

  useEffect(() => {
    if (curatorProps.isError || userProps.isError) {
      toast.error('Ошибка при подтверждении оценки');
    }
  }, [curatorProps.isError, userProps.isError]);

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Редактировать оценку"
      className="sm:max-w-5xl"
      onSubmit={confirm}
      loading={curatorProps.isLoading || userProps.isLoading}
    >
      <div className="flex flex-col gap-4 mt-4 text-sm">
        <div className="flex flex-col gap-2">
          <h2 className="text-violet-600 font-semibold text-xl">
            {rate.user.username}
          </h2>
          <p className="text-gray-500">
            Специализация:{' '}
            <span className="text-gray-800 font-medium">{rate.spec.name}</span>
          </p>
          <p className="text-gray-500">
            Навыки:{' '}
            <span className="text-gray-800 font-medium">
              {rateTypeNames[rate.type]}
            </span>
          </p>
          <p className="text-gray-500">
            Команда:{' '}
            <span className="text-gray-800 font-medium">{rate.team.name}</span>
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <ConfirmTitle
            blocked={curatorBlocked}
            title="Руководители"
            setAddType={setAddType}
            type="CURATOR"
          />
          <ConfirmTitle
            title="Коллеги"
            setAddType={setAddType}
            type="TEAM_MEMBER"
          />
          <ConfirmTitle
            title="Подчиненные"
            setAddType={setAddType}
            type="SUBORDINATE"
          />

          <EvaluatorsList
            type="CURATOR"
            evaluators={selectedSpecs[0].specs[0].evaluateCurators}
            onClick={onDelete}
            edittable={!curatorBlocked}
          />
          <EvaluatorsList
            type="TEAM_MEMBER"
            evaluators={selectedSpecs[0].specs[0].evaluateTeam}
            onClick={onDelete}
          />
          <EvaluatorsList
            type="SUBORDINATE"
            evaluators={selectedSpecs[0].specs[0].evaluateSubbordinate}
            onClick={onDelete}
          />
        </div>
        <Modal
          open={!!addType}
          setOpen={() => setAddType(undefined)}
          title="Добавить оценивающего"
          onSubmit={() => onSubmit(addType!)}
          className="sm:max-w-3xl"
        >
          <EvaluatorsForm
            selectedSpecs={selectedSpecs}
            specId={rate.specId}
            teamId={rate.teamId}
            type={addType!}
            userId={rate.userId}
            selected={selected}
            setSelected={setSelected}
          />
        </Modal>
      </div>
    </Modal>
  );
}
