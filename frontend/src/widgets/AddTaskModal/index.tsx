import { Ipr, TaskPriority, TaskType } from '@/entities/ipr';
import { PrioritySelector } from '@/entities/ipr/ui/partials/tasks/TaskItem/PrioritySelector';
import { MaterialType } from '@/entities/material';
import AddMaterialType from '@/entities/material/ui/AddMaterialType';
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight';
import { Modal } from '@/shared/ui/Modal';
import { SoftButton } from '@/shared/ui/SoftButton';
import { TextArea } from '@/shared/ui/TextArea';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import SelectMaterialWrapper from './SelectMaterialWrapper';
import { skillsApi } from '@/shared/api/skillsApi';
import { Competency, Indicator } from '@/entities/skill';
import DatePickerLight from '@/shared/ui/DatePickerLight';
import { AddTaskDto, iprApi } from '@/shared/api/iprApi';
import toast from 'react-hot-toast';

type AddTaskModalProps = {
  type?: 'COMPETENCY' | 'INDICATOR';
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
};

type ModalDataType = {
  planId: number;
  userId: number;
  taskType: TaskType;
  competencyId?: number;
  indicatorId?: number;
  skillType?: Ipr['skillType'];
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
  const [mutate, { isLoading, isSuccess, isError }] =
    iprApi.useAddTaskMutation();

  const { competencyId, indicatorId, planId, taskType, userId, skillType } =
    modalData as ModalDataType;

  const [materialWrapperId, setMaterialWrapperId] = useState<number>(
    competencyId || indicatorId || -1,
  );
  const [priority, setPriority] = useState<TaskPriority>('LOW');
  const [materialType, setMaterialType] = useState<MaterialType>('VIDEO');
  const [date, setDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<ErorrsType>({});

  const { data: skills, isLoading: isLoadingSkills } =
    skillsApi.useGetSkillsQuery();

  const { competencies, indicators } = useMemo(() => {
    const competencies: Competency[] = [];
    const indicators: Indicator[] = [];
    skills?.forEach((skill) => {
      if (!skillType || skillType === skill.type) {
        skill.competencies.forEach((competency) => {
          competencies.push(competency);
          competency.indicators.forEach((indicator) => {
            indicators.push(indicator);
          });
        });
      }
    });
    return { competencies, indicators };
  }, [skills, skillType]);

  const selectMaterialType = useCallback(
    (type: MaterialType) => {
      setMaterialType(type);
    },
    [setMaterialType],
  );

  const selectPriority = useCallback((priority: TaskPriority) => {
    setPriority(priority);
  }, []);

  const selectMaterialWrapper = useCallback((id: number) => {
    setMaterialWrapperId(id);
  }, []);

  const onChangeDate = useCallback((date: Date) => {
    setDate(date);
  }, []);

  const validate = () => {
    const newErrors: ErorrsType = {};
    if (!title.trim()) newErrors.title = 'Поле не может быть пустым';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = () => {
    if (!validate()) return;
    const payload: AddTaskDto = {
      ...(materialWrapperId > 0 && {
        [type === 'COMPETENCY' ? 'competencyId' : 'indicatorId']:
          materialWrapperId,
      }),
      name: title,
      url: link,
      contentType: materialType,
      priority,
      deadline: date ? date.toISOString() : null,
      planId,
      taskType,
      userId,
    };
    mutate(payload);
  };

  const materialWrapperData = type === 'COMPETENCY' ? competencies : indicators;

  useEffect(() => {
    if (isSuccess) {
      toast.success('Материал успешно добавлен');
      closeModal();
    }
  }, [isSuccess, closeModal]);

  useEffect(() => {
    if (isError) {
      toast.error('Ошибка при добавлении материала');
    }
  }, [isError]);

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title={'Новый материал'}
      footer={false}
      loading={isLoadingSkills || isLoading}
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
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-1">
            {type === 'COMPETENCY' ? 'Компетенция' : 'Индикатор'}
          </p>
          <SelectMaterialWrapper
            data={materialWrapperData}
            selected={materialWrapperId}
            select={selectMaterialWrapper}
          />
        </div>
        <DatePickerLight
          value={date}
          onChange={onChangeDate}
          placeholder={'Выберите дату'}
          minDate={new Date()}
          label={'Дедлайн'}
        />
        <InputWithLabelLight
          label="Ссылка"
          placeholder="https://example.com/"
          value={link}
          onChange={(e) => setLink(e.target.value)}
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
