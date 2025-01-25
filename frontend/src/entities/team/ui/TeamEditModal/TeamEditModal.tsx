import { Modal } from '@/shared/ui/Modal'
import { Team } from '../../types/types'
import { teamsApi } from '@/shared/api/teamsApi'
import { ChangeEvent, useEffect, useState } from 'react'
import { InputWithLabelLight } from '@/shared/ui/InputWithLabelLight'

interface TeamEditModalProps {
  team?: Team
  setTeam: (team?: Team) => void
}

export default function TeamEditModal({ setTeam, team }: TeamEditModalProps) {
  const [mutate, { isLoading, isSuccess }] = teamsApi.useUpdateTeamMutation()
  const [name, setName] = useState(team?.name)
  const [error, setError] = useState('')

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    setError('')
  }
  const onSubmit = () => {
    if (!team) return
    if (!name) {
      setError('Введите название')
      return
    }
    mutate({ id: team.id, team: { name } })
  }
  useEffect(() => {
    if (isSuccess) {
      setTeam(undefined)
    }
  }, [isSuccess])

  useEffect(() => {
    setName(team?.name)
  }, [team])

  return (
    <Modal open={!!team} setOpen={(v) => setTeam(v ? team : undefined)} loading={isLoading} onSubmit={onSubmit}>
      <InputWithLabelLight label="Название" value={name} onChange={onChange} error={error} />
    </Modal>
  )
}
