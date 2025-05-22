import { skillsApi } from '@/shared/api/skillsApi';
import { universalApi } from '@/shared/api/universalApi';
import { Checkbox } from '@/shared/ui/Checkbox';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { Modal } from '@/shared/ui/Modal';
import { FC, useEffect, useMemo, useState } from 'react';

interface ChooseCompetencyBlockModalData {
  specId: number;
  initialBlocks: number[];
}

interface ChooseCompetencyBlockModalProps {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
}

const ChooseCompetencyBlockModal: FC<ChooseCompetencyBlockModalProps> = ({
  isOpen,
  modalData,
  closeModal,
}) => {
  const { specId, initialBlocks } = modalData as ChooseCompetencyBlockModalData;
  const [selected, setSelected] = useState<number[]>(initialBlocks);
  const { data, isFetching } = skillsApi.useGetSkillsQuery();
  const [mutate, { isLoading, isSuccess }] =
    skillsApi.useAddBlockToSpecMutation();
  const { refetch } = universalApi.useGetSpecsQuery();
  const [search, setSearch] = useState<string>('');

  const filteredBySearch = useMemo(() => {
    if (!data) return [];
    return data.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, data]);

  const hardSkills = filteredBySearch.filter((skill) => skill.type === 'HARD');
  const softSkills = filteredBySearch.filter((skill) => skill.type === 'SOFT');

  const generateOnChange = (id: number) => () => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const onSubmit = () => {
    mutate({ specId, blockIds: selected });
  };

  useEffect(() => {
    if (isSuccess) {
      closeModal();
      refetch();
    }
  }, [isSuccess]);

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title="Выбрать компетенции"
      onSubmit={onSubmit}
      submitText="Добавить"
      loading={isFetching || isLoading}
      className="sm:max-w-2xl"
    >
      <InputWithLabelLight
        placeholder="Поиск..."
        className="mt-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium text-gray-800">Hard skills</h3>
          {hardSkills?.map((skill) => (
            <Checkbox
              key={skill.id}
              checked={selected.includes(skill.id)}
              onChange={generateOnChange(skill.id)}
              title={skill.name}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium text-gray-800">Soft skills</h3>
          {softSkills?.map((skill) => (
            <Checkbox
              key={skill.id}
              checked={selected.includes(skill.id)}
              onChange={generateOnChange(skill.id)}
              title={skill.name}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default ChooseCompetencyBlockModal;
