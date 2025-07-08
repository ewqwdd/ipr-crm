import { useModal } from '@/app/hooks/useModal';
import { testsApi } from '@/shared/api/testsApi';
import { useIsAdmin } from '@/shared/hooks/useIsAdmin';
import { $api } from '@/shared/lib/$api';
import { cva } from '@/shared/lib/cva';
import { Dropdown } from '@/shared/ui/Dropdown';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import { FC, memo, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

type TestRowDropdownProps = {
  hidden?: boolean;
  testId?: number;
};

const TestRowDropdown: FC<TestRowDropdownProps> = ({ hidden, testId }) => {
  const { openModal } = useModal();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();

  const downloadExcel = (id: number) => {
    console.log('Download Excel triggered for test ID:', id);
    window.open(import.meta.env.VITE_API_URL + `/test/${id}/excel`, '_blank');
  };

  const [toggleHide, toggleHiddenState] = testsApi.useToggleHiddenMutation();
  const [testDelete, testDeleteState] = testsApi.useTestDeleteMutation();
  const [testCopy, testCopyState] = testsApi.useTestCopyMutation();

  const notify = () => {
    $api
      .post('/test/' + testId + '/notify')
      .then(() => {
        toast.success('Уведомления отправлены');
      })
      .catch(() => {
        toast.error('Ошибка при отправке уведомлений');
      });
  };

  const handleItemClick = useCallback((itemId: string) => {
    switch (itemId) {
      case 'edit':
        navigate(`/tests-edit/${testId}`);
        break;
      case 'hide':
        toggleHide({ id: testId!, hidden: true });
        break;
      case 'show':
        toggleHide({ id: testId!, hidden: false });
        break;
      case 'results':
        downloadExcel(testId!);
        break;
      case 'assign':
        openModal('ASSESMENT_ASSIGN_USERS', {
          testId,
        });
        break;
      case 'notify':
        notify();
        break;
      case 'delete':
        testDelete(testId!);
        break;
      case 'copy':
        testCopy(testId!);
        break;
      default:
        console.log('Unknown action');
        break;
    }
  }, []);

  const dropdownItems = [
    { id: 'edit', label: 'Редактировать тест' },
    { id: 'copy', label: 'Скопировать тест' },
    hidden
      ? { id: 'show', label: 'Сделать доступным' }
      : { id: 'hide', label: 'Скрыть доступ' },
    {
      id: 'results',
      label: 'Выгрузить результаты',
      onClick: () => downloadExcel(testId!),
    },
    { id: 'assign', label: 'Назначить участников' },
    { id: 'notify', label: 'Напомнить' },
    isAdmin && { id: 'delete', label: 'Удалить' },
  ]
    .filter((item): item is { id: string; label: string } => Boolean(item))
    .map((item) => ({
      text: item.label,
      onClick: () => handleItemClick(item.id),
    }));

  return (
    <Dropdown
      button={<DotsVerticalIcon className="w-5 h-5" />}
      btnClassName="bg-indigo-50 text-indigo-500 transition-all duration-100 p-1 hover:bg-indigo-100 hover:text-indigo-500"
      buttons={dropdownItems}
      bodyClassName={cva('z-10', {
        'pointer-events-none animate-pulse':
          toggleHiddenState.isLoading ||
          testDeleteState.isLoading ||
          testCopyState.isLoading,
      })}
    />
  );
};

export default memo(TestRowDropdown);
