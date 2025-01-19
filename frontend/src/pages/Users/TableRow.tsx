import { User } from '@/entities/user'
import { Link } from 'react-router'

interface TableRowProps {
  person: User
}

export default function TableRow({ person }: TableRowProps) {
  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <img
              className="h-10 w-10 rounded-full"
              src={
                person.avatar
              }
              alt="avatar"
            />
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">
              {person.firstName} {person.lastName}
            </div>
            <div className="text-gray-500">{person.email}</div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <div className="text-gray-900">{person.Spec?.name}</div>
        <div className="text-gray-500">{person.username}</div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.phone}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
          {person.role.name}
        </span>
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <Link to={'/userEdit/' + person.id} className="text-indigo-600 hover:text-indigo-900">
          Edit<span className="sr-only">, {person.username}</span>
        </Link>
      </td>
    </tr>
  )
}
