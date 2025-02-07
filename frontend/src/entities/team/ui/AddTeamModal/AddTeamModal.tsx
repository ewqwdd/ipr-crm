import { teamsApi } from '@/shared/api/teamsApi';
import { Modal } from '@/shared/ui/Modal';
import TeamForm from '../TeamForm/TeamForm';
import { CreateTeamDto } from '../../types/types';
import { useEffect, useRef } from 'react';

interface AddTeamModalProps {
  parentId?: number;
  open?: boolean;
  setOpen: (open: boolean) => void;
}

export default function AddTeamModal({
  parentId,
  open,
  setOpen,
}: AddTeamModalProps) {
  const [mutate, { isLoading, isSuccess }] = teamsApi.useCreateTeamMutation();
  const formRef = useRef<HTMLFormElement>(null);
  const onSubmit = (values: CreateTeamDto) => {
    mutate(values);
  };

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
    }
  }, [isSuccess]);

  return (
    <Modal
      open={!!open}
      setOpen={setOpen}
      loading={isLoading}
      title="Add Team"
      footer={false}
    >
      <TeamForm parentId={parentId} ref={formRef} onSubmit={onSubmit} />
    </Modal>
  );
}
