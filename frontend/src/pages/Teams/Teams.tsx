import { TeamItem } from '@/entities/team'
import { teamsApi } from '@/shared/api/teamsApi'
import { Heading } from '@/shared/ui/Heading'
import { PrimaryButton } from '@/shared/ui/PrimaryButton'

export default function Teams() {
  const { data } = teamsApi.useGetTeamsQuery()

  const list = data?.list ?? []

  return (
    <div className="px-8 py-10 flex flex-col">
      <div className="flex justify-between items-center">
        <Heading title="Подразделения" description="Подразделения и пользователи" />
        <PrimaryButton className="self-start">Добавить</PrimaryButton>
      </div>
      <div className="flex flex-col gap-1 max-w-5xl mt-8">
        {list.map((team) => (
          <TeamItem key={team.id} team={team} />
        ))}
      </div>
    </div>
  )
}
