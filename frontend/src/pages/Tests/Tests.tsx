import { $api } from '@/shared/lib/$api';
import { Heading } from '@/shared/ui/Heading';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function Tests() {
  const navigate = useNavigate();

  useEffect(() => {
    $api.get('/test');
  }, []);

  return (
    <div className="px-8 py-10 flex flex-col h-full relative">
      <div className="flex justify-between items-center">
        <Heading title="Тесты" />
        <PrimaryButton
          onClick={() => navigate('/tests/create')}
          className="self-start"
        >
          Создать новый тест
        </PrimaryButton>
      </div>
    </div>
  );
}
