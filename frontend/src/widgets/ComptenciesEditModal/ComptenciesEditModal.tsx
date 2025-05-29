import { skillsApi } from '@/shared/api/skillsApi';
import { Modal } from '@/shared/ui/Modal';
import { useMemo } from 'react';
import { CompetencyList } from '../CompetencyList';

interface DeleteTaskModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalData: unknown;
}

interface ModalData {
  blocks: number[];
}

export default function ComptenciesEditModal({
  isOpen,
  modalData,
  closeModal,
}: DeleteTaskModalProps) {
  const { data, isFetching } = skillsApi.useGetSkillsQuery();
  const { blocks } = modalData as ModalData;

  const filterdBlocks = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => blocks.includes(item.id));
  }, [data, blocks]);

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Блоки компетенций"
      loading={isFetching}
      className="sm:max-w-screen-xl max-sm:w-full"
      childrenFlex={false}
    >
      <div className="flex flex-col gap-4 mt-4 overflow-auto max-w-full overflow-x-auto">
        {filterdBlocks.length > 0 ? (
          <CompetencyList data={filterdBlocks} />
        ) : (
          <div className="text-center text-gray-500">
            Нет доступных блоков компетенций
          </div>
        )}
      </div>
    </Modal>
  );
}
