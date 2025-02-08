import { Spec } from '@/entities/user';
import { skillsApi } from '@/shared/api/skillsApi';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Modal } from '@/shared/ui/Modal';
import { useMemo, useState } from 'react';

interface AddBlockToSpecModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (name: number[]) => void;
  loading?: boolean;
  spec: Spec;
  initialSkills?: number[];
}

export default function AddBlockToSpecModal({
  open,
  setOpen,
  spec,
  onSubmit,
  loading,
  initialSkills,
}: AddBlockToSpecModalProps) {
  const [values, setValues] = useState<number[]>(initialSkills || []);
  const { data } = skillsApi.useGetSkillsQuery();

  const hardSkills = useMemo(
    () => data?.filter((skill) => skill.type === 'HARD'),
    [data],
  );
  const softSkills = useMemo(
    () => data?.filter((skill) => skill.type === 'SOFT'),
    [data],
  );

  const onChange = (id: number) => {
    if (values.includes(id)) {
      setValues(values.filter((v) => v !== id));
    } else {
      setValues([...values, id]);
    }
  }

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Выбрать индикаторы"
      onSubmit={() => onSubmit(values)}
      submitText="Добавить"
      loading={loading}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-500 mt-2">
          Специализация:{' '}
          <span className="text-gray-900 ml-1">{spec?.name}</span>
        </p>
        <div className="flex gap-3">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold text-gray-800">
              Hard skills
            </span>
            {hardSkills?.map((skill) => (
              <Checkbox key={skill.id} title={skill.name} onChange={() => onChange(skill.id)} checked={values.includes(skill.id)} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold text-gray-800">
              Soft skills
            </span>
            {softSkills?.map((skill) => (
              <Checkbox key={skill.id} title={skill.name} onChange={() => onChange(skill.id)} checked={values.includes(skill.id)} />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
