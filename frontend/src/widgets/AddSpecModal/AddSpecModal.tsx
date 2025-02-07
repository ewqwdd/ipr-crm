import { universalApi } from '@/shared/api/universalApi';
import { SelectOption } from '@/shared/types/SelectType';
import { Heading } from '@/shared/ui/Heading';
import { Modal } from '@/shared/ui/Modal';
import { SearchSelectMultiple } from '@/shared/ui/SearchSelectMultiple';

interface AddSpecModalProps {
  open?: boolean;
  name?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: SelectOption[];
  setValue: React.Dispatch<React.SetStateAction<SelectOption[]>>;
  onSubmit?: () => void;
  loading?: boolean;
}

export default function AddSpecModal({
  open,
  name,
  value,
  setValue,
  setOpen,
  onSubmit,
  loading,
}: AddSpecModalProps) {
  const { data, isFetching } = universalApi.useGetSpecsQuery();

  const options = data?.map((spec) => ({ id: spec.id, name: spec.name })) ?? [];

  return (
    <Modal
      open={!!open}
      setOpen={setOpen}
      onSubmit={onSubmit}
      loading={loading}
    >
      <Heading
        title="Специализация"
        description="Вы можете заменить или добавить специализацию"
      />
      <span className="font-semibold text-gray-700 text-sm my-6">{name}</span>
      <SearchSelectMultiple
        loading={isFetching}
        options={options}
        value={value}
        setValue={setValue}
      />
    </Modal>
  );
}
