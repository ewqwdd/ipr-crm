import { universalApi } from '@/shared/api/universalApi';
import { cva } from '@/shared/lib/cva';
import { SelectLight } from '@/shared/ui/SelectLight';

interface RolesSelectProps {
  role?: number;
  setRole: (role: number) => void;
}

export default function RolesSelect({ role, setRole }: RolesSelectProps) {
  const { data, isFetching } = universalApi.useGetRolesQuery();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(Number(e.target.value));
  };

  return (
    <SelectLight
      label="Role"
      name="role"
      value={role}
      onChange={onChange}
      className={cva({ 'animate-pulse': isFetching })}
    >
      <option>Выберите роль</option>
      {data &&
        data.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
    </SelectLight>
  );
}
