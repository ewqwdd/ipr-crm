import { MaterialType } from '@/entities/material';
import { InputWithLabel } from '@/shared/ui/InputWithLabel';
import { Modal } from '@/shared/ui/Modal';
import { SelectLight } from '@/shared/ui/SelectLight';
import { TextArea } from '@/shared/ui/TextArea';
import { FC, memo, useCallback, useState } from 'react';
// import Select from 'react-select';
type AddTaskModalProps = {
  type: 'COMPETENCY' | 'INDICATOR';
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
};

const materialTypes = [
  { text: 'Видео', id: 'VIDEO' },
  { text: 'Книга', id: 'BOOK' },
  { text: 'Курс', id: 'COURSE' },
  { text: 'Статья', id: 'ARTICLE' },
];

const AddMaterialType: FC<{
  materialType: string;
  selectMaterialType: (type: MaterialType) => void;
}> = memo(({ materialType, selectMaterialType }) => {
  return (
    <SelectLight
      label="Тип материала"
      name="materialType"
      value={materialType}
      onChange={(e) => selectMaterialType(e.target.value as MaterialType)}
      required
    >
      {materialTypes.map(({ id, text }) => (
        <option key={id} value={id}>
          {text}
        </option>
      ))}
    </SelectLight>
  );
});

// const

type ErorrsType = { title?: string; link?: string };

const AddTaskModal: FC<AddTaskModalProps> = ({
  isOpen,
  modalData,
  closeModal,
}) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [materialType, setMaterialType] = useState<MaterialType>('VIDEO');
  const [errors, setErrors] = useState<ErorrsType>({});

  const selectMaterialType = useCallback(
    (type: MaterialType) => {
      setMaterialType(type);
    },
    [setMaterialType],
  );

  return (
    <Modal
      open={isOpen}
      setOpen={closeModal}
      title={'Новый материал'}
      footer={false}
      //   loading={isLoading}
      //   onSubmit={onSubmit}
    >
      <div className="mt-4">
        {/* <InputWithLabelLight
          autoComplete="email"
          label="Почта"
          value={email}
          onChange={(e) => {
            setError('');
            setEmail(e.target.value);
          }}
          error={error}
        /> */}
        <TextArea />
        {/* <Select options={} value={} onChange={} /> */}
        <InputWithLabel />
        <InputWithLabel />
        <AddMaterialType {...{ selectMaterialType, materialType }} />
        <SelectLight
        //
        >
          {/*  */}
        </SelectLight>
      </div>
    </Modal>
  );
};

export default AddTaskModal;
