import { Team } from '@/entities/team'
import { teamsApi } from '@/shared/api/teamsApi'
import { cva } from '@/shared/lib/cva'
import Select, { ActionMeta, MultiValue } from 'react-select'

export type Option = { value: number; label: string }

interface TeamsMultiSelectProps {
  value?: MultiValue<Option>
  onChange?: (newValue: MultiValue<Option>, actionMeta: ActionMeta<Option>) => void
  loading?: boolean
  disabledTeams?: number[]
}

export default function TeamsMultiSelect({ onChange, value, loading, disabledTeams = [] }: TeamsMultiSelectProps) {
  const { data, isLoading } = teamsApi.useGetTeamsQuery()
  const teams = data?.list ?? []
  const options = teams.filter(t => !disabledTeams?.includes(t.id)).map((team) => ({ value: team.id, label: team.name }))

  return (
    <Select
      isMulti
      name="teams"
      onChange={onChange}
      options={options}
      value={value}
      className={cva('basic-multi-select', {
        'animate-pulse': !!loading || isLoading,
      })}
      classNamePrefix="select"
    />
  )
}
