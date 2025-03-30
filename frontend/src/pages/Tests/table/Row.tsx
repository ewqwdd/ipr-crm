import { Test } from '@/entities/test';
import { cva } from '@/shared/lib/cva';
// import { Dropdown } from '@/shared/ui/Dropdown';
import { SoftButton } from '@/shared/ui/SoftButton';
import {
  ArchiveIcon,
  DocumentTextIcon,
  // DotsVerticalIcon,
} from '@heroicons/react/outline';
import { Link } from 'react-router';
import { TestRowDropdown } from './TestRowDropdown';

const Row = ({ id, name }: Partial<Test>) => {
  // const archived = true; // Replace with actual archived state if needed
  const archived = false; // Replace with actual archived state if needed
  const anonymous = true; // Replace with actual anonymous state if needed

  return (
    <tr
      className={cva({
        'opacity-50': archived,
        'opacity-100': !archived,
      })}
    >
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 ">
        <div className="flex space-x-2 items-center">
          {anonymous && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-incognito"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="m4.736 1.968-.892 3.269-.014.058C2.113 5.568 1 6.006 1 6.5 1 7.328 4.134 8 8 8s7-.672 7-1.5c0-.494-1.113-.932-2.83-1.205l-.014-.058-.892-3.27c-.146-.533-.698-.849-1.239-.734C9.411 1.363 8.62 1.5 8 1.5s-1.411-.136-2.025-.267c-.541-.115-1.093.2-1.239.735m.015 3.867a.25.25 0 0 1 .274-.224c.9.092 1.91.143 2.975.143a30 30 0 0 0 2.975-.143.25.25 0 0 1 .05.498c-.918.093-1.944.145-3.025.145s-2.107-.052-3.025-.145a.25.25 0 0 1-.224-.274M3.5 10h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5m-1.5.5q.001-.264.085-.5H2a.5.5 0 0 1 0-1h3.5a1.5 1.5 0 0 1 1.488 1.312 3.5 3.5 0 0 1 2.024 0A1.5 1.5 0 0 1 10.5 9H14a.5.5 0 0 1 0 1h-.085q.084.236.085.5v1a2.5 2.5 0 0 1-5 0v-.14l-.21-.07a2.5 2.5 0 0 0-1.58 0l-.21.07v.14a2.5 2.5 0 0 1-5 0zm8.5-.5h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5"
              />
            </svg>
          )}
          {archived && <ArchiveIcon className="w-5 h-5 text-gray-500" />}
        </div>
        {/* <div className="flex items-center">
              <Link to={`/users/${person?.id}`} className="h-10 w-10 flex-shrink-0">
                {person.avatar ? (
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={person.avatar}
                    alt="avatar"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                )}
              </Link>
              <div className="ml-4">
                <Link
                  to={`/users/${person?.id}`}
                  className="font-medium text-gray-900"
                >
                  {person.firstName} {person.lastName}
                </Link>
                <div className="text-gray-500">{person.email}</div>
              </div>
            </div> */}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <Link to={`/tests/${id}`} className="h-10 w-10 flex-shrink-0">
          {name}
        </Link>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 flex gap-2 flex-wrap">
        {/* {person.teams?.map((e, index) => (
              <span key={e.teamId}>
                {e?.team?.name}
                {index !== person.teams!.length - 1 && ', '}
              </span>
            ))} */}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {/* <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
              {person.role?.name}
            </span> */}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <div className="flex justify-between">
          <SoftButton
            className="rounded-full p-1"
            onClick={() => {
              // openModal('RATE_STATS', {
              //   rate,
              //   spec: foundSpec,
              //   user: foundUser,
              //   indicators,
              // })
            }}
          >
            <DocumentTextIcon className="h-5 w-5" />
          </SoftButton>
          {/* <Dropdown
            button={<DotsVerticalIcon className="w-5 h-5" />}
            // btnClassName="text-indigo-500 hover:text-indigo-700 bg-transparent transition-all duration-100 p-2"
          >

          </Dropdown>           */}
          {/* <SoftButton className="rounded-full p-1">
            <DotsVerticalIcon className="w-5 h-5" />
          </SoftButton> */}
          <TestRowDropdown />
        </div>
        {/* {edit && (
              <Link
                to={'/userEdit/' + person.id}
                className="text-indigo-600 hover:text-indigo-900"
              >
                Edit<span className="sr-only">, {person.username}</span>
              </Link>
            )} */}
      </td>
    </tr>
  );
};

export default Row;
