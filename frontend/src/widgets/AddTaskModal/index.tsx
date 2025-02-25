import { TaskPriority } from '@/entities/ipr';
import { PrioritySelector } from '@/entities/ipr/ui/partials/tasks/PrioritySelector';
import { MaterialType } from '@/entities/material';
import AddMaterialType from '@/entities/material/ui/AddMaterialType';
import { checkLinkFormat } from '@/entities/material/ui/helpers';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { Modal } from '@/shared/ui/Modal';
import { SoftButton } from '@/shared/ui/SoftButton';
import { TextArea } from '@/shared/ui/TextArea';
import { FC, useCallback, useMemo, useState } from 'react';
import SelectMaterialWrapper from './SelectMaterialWrapper';
import { skillsApi } from '@/shared/api/skillsApi';
import { Competency, Indicator } from '@/entities/skill';
import DatePickerLight from '@/shared/ui/DatePickerLight';

type AddTaskModalProps = {
  type: 'COMPETENCY' | 'INDICATOR';
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
};

type ErorrsType = { title?: string; link?: string };

const AddTaskModal: FC<AddTaskModalProps> = ({
  isOpen,
  modalData,
  closeModal,
  type,
}) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [materialWrapperId, setMaterialWrapperId] = useState<
    number | undefined
  >(modalData?.competencyId || modalData?.indicatorId);
  const [priority, setPriority] = useState<TaskPriority>('LOW');
  const [materialType, setMaterialType] = useState<MaterialType>('VIDEO');
  const [date, setDate] = useState<Date>(new Date());
  const [errors, setErrors] = useState<ErorrsType>({});

  const { data: skills, isLoading: isLoadingSkills } =
    skillsApi.useGetSkillsQuery();

  const { competencies, indicators } = useMemo(() => {
    const competencies: Competency[] = [];
    const indicators: Indicator[] = [];
    skills?.forEach((skill) => {
      skill.competencies.forEach((competency) => {
        competencies.push(competency);
        competency.indicators.forEach((indicator) => {
          indicators.push(indicator);
        });
      });
    });
    return { competencies, indicators };
  }, [skills]);

  console.log('indicators => ', indicators);

  const selectMaterialType = useCallback(
    (type: MaterialType) => {
      setMaterialType(type);
    },
    [setMaterialType],
  );

  const selectPriority = useCallback((priority: TaskPriority) => {
    setPriority(priority);
  }, []);

  const selectMaterialWrapper = (id: number) => {
    setMaterialWrapperId(id);
  };

  const onChangeDate = (date: Date) => {
    setDate(date);
  };

  const validate = () => {
    const newErrors: ErorrsType = {};
    if (!title.trim()) newErrors.title = 'Поле не может быть пустым';
    const linkError = checkLinkFormat(link);
    if (linkError) newErrors.link = linkError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const payload = {
    [type === 'COMPETENCY' ? 'competencyId' : 'indicatorId']: materialWrapperId,
    title,
    link,
    materialType,
    priority,
    deadline: date, // TODO: format date to backand format
  };

  const onSubmit = () => {
    if (!validate()) return;
    switch (type) {
      case 'COMPETENCY':
        console.log('payload => ', payload);
        break;
      case 'INDICATOR':
        console.log('payload => ', payload);
        break;
      default:
        break;
    }
  };

  const materialWrapperData = type === 'COMPETENCY' ? competencies : indicators;

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title={'Новый материал'}
      footer={false}
      loading={isLoadingSkills}
    >
      <div className="flex flex-col gap-4 mt-4">
        <TextArea
          label="Название"
          placeholder="Введите название материала"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => validate()}
          required
          error={errors.title}
        />
        <SelectMaterialWrapper
          data={materialWrapperData}
          selected={materialWrapperId}
          select={selectMaterialWrapper}
        />
        <DatePickerLight
          value={date}
          onChange={onChangeDate}
          required={true}
          minDate={new Date()}
          label={'Дедлайн'}
        />
        <InputWithLabelLight
          label="Ссылка"
          placeholder="https://example.com/"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onBlur={() => validate()}
          required
          error={errors.link}
        />
        <AddMaterialType {...{ selectMaterialType, materialType }} />
        <PrioritySelector
          isLabel={true}
          required={true}
          priority={priority}
          onChange={selectPriority}
        />
        <SoftButton onClick={onSubmit} className="ml-auto">
          Сохранить
        </SoftButton>
      </div>
    </Modal>
  );
};

export default AddTaskModal;
