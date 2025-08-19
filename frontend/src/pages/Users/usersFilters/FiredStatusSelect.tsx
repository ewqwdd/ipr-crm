import { UsersFilter } from '@/entities/user';
import { Checkbox } from '@/shared/ui/Checkbox';

interface FiredStatusSelectProps {
  onChange: (value: boolean) => void;
  value: UsersFilter['fired'];
}

export default function FiredStatusSelect({
  value,
  onChange,
}: FiredStatusSelectProps) {
  return (
    <Checkbox
      title="Уволен"
      onChange={() => onChange(!value)}
      checked={value}
    />
  );
}
