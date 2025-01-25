import { Accordion } from '@/shared/ui/Accordion'
import { Team } from '../../types/types'
import { SoftButton } from '@/shared/ui/SoftButton'
import { Link } from 'react-router'
import { PencilAltIcon, TrashIcon } from '@heroicons/react/outline'
import { PrimaryButton } from '@/shared/ui/PrimaryButton'
import { MouseEvent, useEffect, useState } from 'react'
import { Modal } from '@/shared/ui/Modal'
import { teamsApi } from '@/shared/api/teamsApi'
import TeamEditModal from '../TeamEditModal/TeamEditModal'
import TeamUserItem from './TeamUserItem'

interface TeamItemProps {
  team: Team
}

export default function TeamItem({ team }: TeamItemProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState<Team>()
  const [mutate, { isLoading: deleteLoading, isSuccess: deleteSuccess }] = teamsApi.useRemoveTeamMutation()
  

  const handleDelete = () => {
    mutate(team.id)
  }
  const openDelete = (e: MouseEvent) => {
    e.stopPropagation()
    setDeleteOpen(true)
  }

  const openEdit = (e: MouseEvent) => {
    e.stopPropagation()
    setEditOpen(team)
  }

  useEffect(() => {
    if (deleteSuccess) {
      setDeleteOpen(false)
    }
  }, [deleteSuccess])

  const title = (
    <div className="flex items-center">
      <Link
        to={`/teams/${team.id}`}
        className="text-indigo-500 px-4 py-1 ml-2 hover:bg-indigo-100 rounded-lg transition-all"
      >
        {team.name}
      </Link>
      <span className="text-gray-700 text-sm ml-4">{(team.users?.length ?? 0) + (team.curator ? 1 : 0)} users</span>
      <PrimaryButton onClick={openDelete} className="p-1 rounded-full ml-auto mr-4" danger>
        <TrashIcon className="h-5 w-5" />
      </PrimaryButton>
      <SoftButton onClick={openEdit} className="p-1 rounded-full mr-4">
        <PencilAltIcon className="h-5 w-5" />
      </SoftButton>
    </div>
  )

  return (
    <>
      <Accordion title={title} btnClassName="hover:bg-gray-200/50">
        <div className="pl-8 pb-2 flex flex-col gap-3">
          {team.curator && (
            <>
              <TeamUserItem teamId={team.id} user={team.curator} curator />
              <div className="w-full border-b border-b-gray-300" />
            </>
          )}
          {team.users?.map((user) => <TeamUserItem teamId={team.id} user={user.user} />)}
        </div>
      </Accordion>
      <Modal
        open={deleteOpen}
        onSubmit={handleDelete}
        loading={deleteLoading}
        setOpen={setDeleteOpen}
        title="Удалить команду"
        submitText="Удалить"
        variant="error"
        cancelText="Отмена"
      />
      <TeamEditModal setTeam={setEditOpen} team={editOpen} />
    </>
  )
}
