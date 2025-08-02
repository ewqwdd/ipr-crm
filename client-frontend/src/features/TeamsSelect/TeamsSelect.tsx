import { useGetTeams } from "@/shared/hooks/teams";
import SearchSelect from "@/shared/ui/SearchSelect";
import { memo } from "react";

interface TeamsSelectProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

export default memo(function TeamsSelect({
  value,
  onChange,
}: TeamsSelectProps) {
  const { data, isPending } = useGetTeams();

  return (
    <SearchSelect
      options={
        data?.list.map((u) => ({ label: u.name, value: u.id.toString() })) || []
      }
      value={value?.toString()}
      onChange={(e) => onChange(e ? Number(e.value) : undefined)}
      placeholder="Команда"
      loading={isPending}
    />
  );
});
