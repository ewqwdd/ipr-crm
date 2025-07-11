import { Test } from '@/entities/test';
import { SoftButton } from '@/shared/ui/SoftButton';
import {
  ArchiveIcon,
  DocumentReportIcon,
  EyeIcon,
  EyeOffIcon,
} from '@heroicons/react/outline';
import TestRowDropdown from './TestRowDropdown';
import WithAdminAccess from '@/shared/ui/WithAdminAccess';
import Tooltip from '@/shared/ui/Tooltip';
import { useModal } from '@/app/hooks/useModal';
import { dateService } from '@/shared/lib/dateService';

const Row = ({
  id,
  hidden,
  name,
  endDate,
  archived,
  anonymous,
}: Partial<Test> & { isAdmin?: boolean }) => {
  const { openModal } = useModal();

  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 ">
        <div className="flex items-center space-x-2">
          {anonymous && (
            <Tooltip content="Анонимный" position="top" align="left">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="scale-125"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="m4.736 1.968-.892 3.269-.014.058C2.113 5.568 1 6.006 1 6.5 1 7.328 4.134 8 8 8s7-.672 7-1.5c0-.494-1.113-.932-2.83-1.205l-.014-.058-.892-3.27c-.146-.533-.698-.849-1.239-.734C9.411 1.363 8.62 1.5 8 1.5s-1.411-.136-2.025-.267c-.541-.115-1.093.2-1.239.735m.015 3.867a.25.25 0 0 1 .274-.224c.9.092 1.91.143 2.975.143a30 30 0 0 0 2.975-.143.25.25 0 0 1 .05.498c-.918.093-1.944.145-3.025.145s-2.107-.052-3.025-.145a.25.25 0 0 1-.224-.274M3.5 10h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5m-1.5.5q.001-.264.085-.5H2a.5.5 0 0 1 0-1h3.5a1.5 1.5 0 0 1 1.488 1.312 3.5 3.5 0 0 1 2.024 0A1.5 1.5 0 0 1 10.5 9H14a.5.5 0 0 1 0 1h-.085q.084.236.085.5v1a2.5 2.5 0 0 1-5 0v-.14l-.21-.07a2.5 2.5 0 0 0-1.58 0l-.21.07v.14a2.5 2.5 0 0 1-5 0zm8.5-.5h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5"
                />
              </svg>
            </Tooltip>
          )}
          <WithAdminAccess>
            <Tooltip
              content={hidden ? 'Черновик' : 'Опубликован'}
              position="top"
              align="left"
            >
              {hidden ? (
                <EyeOffIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </Tooltip>
          </WithAdminAccess>
          {archived && (
            <Tooltip content="Архивирован" position="top" align="left">
              <ArchiveIcon className="w-5 h-5 text-gray-500" />
            </Tooltip>
          )}
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {name}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {endDate && dateService.formatDate(endDate)}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <div className="flex gap-6 ">
          <SoftButton
            className="rounded-full p-1"
            onClick={() => {
              openModal('RATE_TESTS', {
                testId: id,
                testName: name,
              });
            }}
          >
            <DocumentReportIcon className="h-5 w-5" />
          </SoftButton>
          <TestRowDropdown hidden={hidden} testId={id} />
        </div>
      </td>
    </tr>
  );
};

export default Row;
