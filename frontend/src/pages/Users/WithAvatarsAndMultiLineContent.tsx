import { usersApi } from '@/shared/api/usersApi'
import TableRow from './TableRow'
import { cva } from '@/shared/lib/cva'
import { useState } from 'react'
import { Pagination } from '@/shared/ui/Pagination'

const LIMIT = 10

export default function WithAvatarsAndMultiLineContent() {
  const [page, setPage] = useState<number>(1)
  const { data, isFetching } = usersApi.useGetUsersQuery({ page, limit: LIMIT })
  const users = data?.users || []

  return (
    <div
      className={cva('overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg', {
        'animate-pulse': isFetching,
      })}
    >
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Name
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Username
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Phone
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Role
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {!isFetching && users.map((person) => <TableRow key={person.id} person={person} />)}
          {isFetching && new Array(LIMIT).fill(0).map((_, index) => <TableRow edit={false} key={index} person={{}} />)}
        </tbody>
      </table>
      <Pagination count={data?.count} limit={LIMIT} page={page} setPage={setPage} />
    </div>
  )
}
