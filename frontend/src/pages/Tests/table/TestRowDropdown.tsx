import { useModal } from '@/app/hooks/useModal';
import { useIsAdmin } from '@/shared/hooks/useIsAdmin';
import { Dropdown } from '@/shared/ui/Dropdown';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import { FC, memo, useCallback } from 'react';

type TestRowDropdownProps = {
  hidden?: boolean;
  testId?: number;
};

const TestRowDropdown: FC<TestRowDropdownProps> = ({ hidden, testId }) => {
  const { openModal } = useModal();
  const isAdmin = useIsAdmin();

  const handleItemClick = useCallback((itemId: string) => {
    switch (itemId) {
      case 'edit':
        // Handle edit action
        console.log('Edit action triggered');
        break;
      case 'hide':
        // Handle hide action
        console.log('Hide access triggered');
        break;
      case 'results':
        // Handle results action
        console.log('Export results triggered');
        break;
      case 'assign':
        openModal('TEST_ASSIGN_USERS', {
          testId,
        });
        break;
      case 'delete':
        // Handle delete action
        console.log('Delete action triggered');
        break;
      default:
        console.log('Unknown action');
        break;
    }
  }, []);

  const dropdownItems = [
    { id: 'edit', label: 'Редактировать тест' },
    isAdmin &&
      (hidden
        ? { id: 'hide', label: 'Сделать доступным' }
        : { id: 'show', label: 'Скрыть доступ' }),
    { id: 'results', label: 'Выгрузить результаты' },
    { id: 'assign', label: 'Назначить участников' },
    { id: 'delete', label: 'Удалить' },
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
      bodyClassName="z-10"
    />
  );
};

export default memo(TestRowDropdown);
