import { Modal } from '@/shared/ui/Modal';
import { Rate } from '../../types/types';
import { usersApi } from '@/shared/api/usersApi/usersApi';
import { teamsApi } from '@/shared/api/teamsApi';
import { rateTypeNames } from '../../model/rateTypeNames';
import { universalApi } from '@/shared/api/universalApi';
import DetailItem from './DetailItem';
import BlockList from './BlockList';
import { useEffect } from 'react';
import { useAppSelector } from '@/app';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { rate360Api } from '@/shared/api/rate360Api';
import toast from 'react-hot-toast';

interface EvaluateModalData {
  rate: Rate;
}

interface EvaluateModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

export default function EvaluateModal({
  closeModal,
  isOpen,
  modalData,
}: EvaluateModalProps) {
  const { rate } = modalData as EvaluateModalData;
  const { data: users, isFetching: usersFetching } =
    usersApi.useGetUsersQuery();
  const { data: teams, isFetching: teamsFetching } =
    teamsApi.useGetTeamsQuery();
  const { data: specs, isFetching: specsFetching } =
    universalApi.useGetSpecsQuery();

  const [
    mutateApproveSelf,
    {
      isLoading: approveSelfLoading,
      isSuccess: isSuccessSelf,
      isError: isErrorSelf,
    },
  ] = rate360Api.useApproveSelfMutation();
  const [mutateApprove, { isLoading: approveLoading, isSuccess, isError }] =
    rate360Api.useApproveAssignedMutation();

  const userId = useAppSelector((state) => state.user.user!.id);

  const foundUser = users?.users.find((user) => user.id === rate.userId);
  const foundTeam = teams?.list.find((team) => team.id === rate.teamId);
  const foundSpec = specs?.find((spec) => spec.id === rate.specId);

  const skills = rate.competencyBlocks;

  const details = [
    {
      label: 'Оцениваемый',
      value: foundUser?.username ?? '',
    },
    {
      label: 'Команда',
      value: foundTeam?.name ?? '',
    },
    {
      label: 'Специализация',
      value: foundSpec?.name ?? '',
    },
    {
      label: 'Навыки',
      value: rateTypeNames[rate.type],
    },
  ];

  const indicators =
    skills?.flatMap((block) =>
      block.competencies.flatMap((competency) => competency.indicators),
    ) ?? [];
  const userRates = rate.userRates.filter((rate) => rate.userId === userId);

  const isCompleted = userRates.length >= indicators.length;

  useEffect(() => {
    if (isSuccess || isSuccessSelf) {
      closeModal();
    }
  }, [isSuccess, isSuccessSelf, closeModal]);

  useEffect(() => {
    if (isError || isErrorSelf) {
      toast.error('Ошибка при завершении опроса');
    }
  }, [isError, isErrorSelf]);

  const onSubmit = () => {
    if (rate.userId === userId) {
      mutateApproveSelf({ rateId: rate.id });
    } else {
      mutateApprove({ rateId: rate.id });
    }
  };

  return (
    <Modal
      title="Оценка 360"
      open={isOpen}
      setOpen={closeModal}
      footer={false}
      loading={
        usersFetching ||
        teamsFetching ||
        specsFetching ||
        approveLoading ||
        approveSelfLoading
      }
      className="sm:max-w-2xl"
    >
      <div className="flex flex-col gap-4 mt-4 text-sm">
        <div className="flex flex-col gap-2">
          {details.map((detail, index) => (
            <DetailItem key={index} label={detail.label} value={detail.value} />
          ))}
        </div>
        <p className="text-sm text-gray-800 my-2">
          Опрос завершится после того как вы дадите ответы на все вопросы в
          анкете. По мере прохождения опроса в каждом блоке будут отражены ваши
          оценки. Данные вами ответы будут преобразованы в баллы и представлены
          без привязки к конкретному человеку.
        </p>
        <BlockList userRates={userRates} rate={rate} skills={skills ?? []} />
        {isCompleted && (
          <PrimaryButton className="self-end" onClick={onSubmit}>
            Завершить опрос
          </PrimaryButton>
        )}
      </div>
    </Modal>
  );
}
