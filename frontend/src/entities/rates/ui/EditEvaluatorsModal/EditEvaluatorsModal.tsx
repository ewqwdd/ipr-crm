import { useEffect } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { TeamItem } from '../EvaluatorsTeamForm';
import { useAppDispatch, useAppSelector } from '@/app';
import { ratesActions } from '../../model/rateSlice';
import { Rate } from '../../types/types';
import { rate360Api } from '@/shared/api/rate360Api';
import toast from 'react-hot-toast';
import { modalActions } from '@/app/store/modalSlice';

interface EvaluateModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

export default function EditEvaluatorsModal({
  closeModal,
  isOpen,
  modalData,
}: EvaluateModalProps) {
  const editEvaluators = useAppSelector((state) => state.rates.editEvaluators);
  const dispatch = useAppDispatch();
  const { rate } = modalData as { rate: Rate };

  const [mutateEvaluators, mutateEvaluatorsState] =
    rate360Api.useEditEvaluatorsMutation();

  useEffect(() => {
    if (mutateEvaluatorsState.isSuccess) {
      toast.success('Оценивающие успешно изменены');
      dispatch(modalActions.closeFullModal());
    }
  }, [mutateEvaluatorsState.isSuccess, closeModal]);

  useEffect(() => {
    if (mutateEvaluatorsState.isError) {
      toast.error('Ошибка при изменении оценивающих');
      dispatch(modalActions.closeFullModal());
    }
  }, [mutateEvaluatorsState.isError, closeModal]);

  useEffect(() => {
    if (!editEvaluators) {
      closeModal();
    }
  }, [editEvaluators, closeModal]);

  useEffect(() => {
    if (!isOpen) {
      dispatch(ratesActions.setEditEvaluators(undefined));
      dispatch(ratesActions.setSelectedSpecs([]));
    }
  }, [isOpen]);

  if (!editEvaluators) {
    return null;
  }

  const onAdd = () => {
    dispatch(
      ratesActions.setSelectedSpecs([
        {
          teamId: rate.teamId,
          specs: [
            {
              userId: rate.userId,
              specId: rate.specId,
              evaluateCurators: editEvaluators.evaluateCurators,
              evaluateTeam: editEvaluators.evaluateTeam,
              evaluateSubbordinate: editEvaluators.evaluateSubbordinate,
            },
          ],
        },
      ]),
    );
  };

  const onSubmit = () => {
    mutateEvaluators({
      rateId: rate.id,
      evaluateCurators: editEvaluators.evaluateCurators.map((e) => e.userId),
      evaluateTeam: editEvaluators.evaluateTeam.map((e) => e.userId),
      evaluateSubbordinate: editEvaluators.evaluateSubbordinate.map(
        (e) => e.userId,
      ),
    });
  };

  return (
    <Modal
      title="Редактировать оценивающих"
      open={isOpen}
      setOpen={closeModal}
      footer={true}
      loading={mutateEvaluatorsState.isLoading}
      className="sm:max-w-4xl"
      onSubmit={onSubmit}
    >
      <TeamItem
        teamId={editEvaluators}
        onDelete={({ evaluatorId }) => {
          dispatch(
            ratesActions.setEditEvaluators((state) => ({
              ...state,
              evaluateCurators: state.evaluateCurators.filter(
                (e) => e.userId !== evaluatorId,
              ),
              evaluateTeam: state.evaluateTeam.filter(
                (e) => e.userId !== evaluatorId,
              ),
              evaluateSubbordinate: state.evaluateSubbordinate.filter(
                (e) => e.userId !== evaluatorId,
              ),
            })),
          );
        }}
        onSubmit={({ evaluators, type }) => {
          dispatch(
            ratesActions.setEditEvaluators({
              ...editEvaluators,
              evaluateCurators:
                type === 'CURATOR'
                  ? evaluators
                  : editEvaluators.evaluateCurators,
              evaluateTeam:
                type === 'TEAM_MEMBER'
                  ? evaluators
                  : editEvaluators.evaluateTeam,
              evaluateSubbordinate:
                type === 'SUBORDINATE'
                  ? evaluators
                  : editEvaluators.evaluateSubbordinate,
            }),
          );
        }}
        onAdd={onAdd}
      />
    </Modal>
  );
}
