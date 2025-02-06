import { teamsApi } from '@/shared/api/teamsApi'
import { Accordion } from '@/shared/ui/Accordion'
import { useMemo, useState } from 'react'
import UserItem from './UserItem'
import { UsersIcon } from '@heroicons/react/outline'
import { TeamsMultiSelect } from '@/widgets/TeamsMultiSelect'
import { Option } from '@/shared/types/Option'
import { MultiValue } from 'react-select'
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight'
import { SpecsMultiSelect } from '@/widgets/SpecsMultiSelect'

export default function AddRate() {
  const { data } = teamsApi.useGetTeamsQuery()
  const [teams, setTeams] = useState<MultiValue<Option>>([])
  const [specs, setSpecs] = useState<MultiValue<Option>>([])

  const filteredSpecs = useMemo(
    () =>
      specs.length > 0 ?
      data?.list?.map((t) => ({
        ...t,
        curator: t.curator?.specsOnTeams?.find((s) => specs.find((sp) => sp.value === s.specId)) ? t.curator : undefined,
        users: t.users?.filter((u) => u.user.specsOnTeams.find((s) => specs.find((sp) => sp.value === s.specId))),
      })) : data?.list,
    [data, specs]
  )
  const filteredEmpty = useMemo(
    () => filteredSpecs?.filter((team) => (team.users && team.users?.length > 0) || team.curator),
    [filteredSpecs]
  )
  const filteredTeams = useMemo(
    () => (teams.length > 0 ? filteredEmpty?.filter((team) => teams.find((t) => t.value === team.id)) : filteredEmpty),
    [teams, filteredEmpty]
  )

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3"></div>

      <h2 className="text-2xl font-semibold">Выберите оцениваемых</h2>

      <div className="grid grid-cols-3 gap-4">
        <TeamsMultiSelect value={teams} onChange={(v) => setTeams(v)} />
        <InputWithLabelLight placeholder="Поиск по ФИО" className="mt-0" />
        <SpecsMultiSelect value={specs} onChange={(v) => setSpecs(v)} />
      </div>

      <div className="flex flex-col gap-2">
        {filteredTeams?.map((team) => (
          <div key={team.id} className="flex flex-col gap-2">
            <Accordion
              title={
                <>
                  <UsersIcon className="size-4" />
                  <span>{team.name}</span>
                </>
              }
              defaultOpen
              titleClassName="text-indigo-600 pl-4 flex gap-2 items-center"
            >
              <div className="flex flex-col gap-2 ml-4">
                {team.curator && <UserItem user={team.curator} />}
                {team.users?.map((user) => <UserItem user={user.user} key={user.user.id} />)}
              </div>
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  )
}
