import { Modal } from '@/shared/ui/Modal';
import { EvaluateUser, EvaulatorType } from '../../types/types';
import { useAppDispatch, useAppSelector } from '@/app';
import { useLayoutEffect, useMemo, useState } from 'react';
import TeamFilters from '../AddRate/TeamFilters/TeamFilters';
import { MultiValue } from 'react-select';
import { Option } from '@/shared/types/Option';
import EvaluatorTeam from './partials/EvaluatorTeam';
import { ratesActions } from '../../model/rateSlice';
import NoTeamEvaluators from './partials/NoTeamEvaluators';
import { useFilteredTeams } from '../../hooks/useFilteredTeams';

interface AddEvaluatorModalData {
  type: EvaulatorType;
  userId: number;
  teamId: number;
  specId: number;
}
interface AddEvaluatorModalProps {
  isOpen: boolean;
  modalData: AddEvaluatorModalData;
  closeModal: () => void;
}

export default function AddEvaluatorModal({
  closeModal,
  isOpen,
  modalData,
}: AddEvaluatorModalProps) {
  const { type, userId, teamId, specId } = modalData;
  const [selected, setSelected] = useState<EvaluateUser[]>([]);
  const dispatch = useAppDispatch();

  const [teams, setTeams] = useState<MultiValue<Option>>([]);
  const [specs, setSpecs] = useState<MultiValue<Option>>([]);
  const [search, setSearch] = useState('');

  const selectedSpecs = useAppSelector((state) => state.rates.selectedSpecs);
  const teamSpecs = useMemo(
    () => selectedSpecs.find((s) => s.teamId === teamId)?.specs ?? [],
    [selectedSpecs, teamId],
  );
  const current = useMemo(
    () => teamSpecs.find((s) => s.specId === specId && s.userId === userId),
    [teamSpecs, specId],
  );

  let evaluators;
  const excluded: EvaluateUser[] = [{ userId }];
  if (type === 'CURATOR') {
    evaluators = current?.evaluateCurators;
    excluded.push(
      ...(current?.evaluateSubbordinate ?? []),
      ...(current?.evaluateTeam ?? []),
    );
  } else if (type === 'TEAM_MEMBER') {
    evaluators = current?.evaluateTeam;
    excluded.push(
      ...(current?.evaluateCurators ?? []),
      ...(current?.evaluateSubbordinate ?? []),
    );
  } else {
    evaluators = current?.evaluateSubbordinate;
    excluded.push(
      ...(current?.evaluateCurators ?? []),
      ...(current?.evaluateTeam ?? []),
    );
  }

  useLayoutEffect(() => {
    if (evaluators) {
      setSelected(
        evaluators.map((e) => ({ userId: e.userId, username: e.username })),
      );
    }
  }, [evaluators]);

  const onSubmit = () => {
    dispatch(
      ratesActions.setSpecsForUser({
        teamId,
        specId,
        userId,
        type,
        evaluators: selected,
      }),
    );
    closeModal();
  };

  const filteredTeams = useFilteredTeams({ specs, teams, search });

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Добавить оценщика"
      onSubmit={onSubmit}
      submitText="Добавить"
      className="w-full sm:max-w-4xl"
    >
      <div className="flex flex-col gap-4 pt-4">
        <TeamFilters
          search={search}
          setSearch={setSearch}
          specs={specs}
          setSpecs={setSpecs}
          teams={teams}
          setTeams={setTeams}
        />
        <NoTeamEvaluators
          setSelected={setSelected}
          excluded={excluded}
          selected={selected}
        />
        {filteredTeams?.map((team) => (
          <EvaluatorTeam
            excluded={excluded}
            selected={selected}
            setSelected={setSelected}
            key={team.id}
            team={team}
          />
        ))}
      </div>
    </Modal>
  );
}
