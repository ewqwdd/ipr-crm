import { CardsRadio } from '@/shared/ui/CardsRadio';
import { memo } from 'react';

interface AccessProps {
  access: string;
  onChange: (access: string) => void;
}

export default memo(function Access({ access, onChange }: AccessProps) {
  return null;
  return (
    <CardsRadio
      elements={[
        {
          title: 'Разрешено гостям',
          description:
            'Прохождение доступно всем пользователям, авторизованным и неавторизованным',
          key: 'PUBLIC',
        },
        {
          title: 'Только авторизованным',
          description:
            'Прохождение доступно только авторизованным пользователям',
          key: 'PRIVATE',
        },
        {
          title: 'По индивидуальной ссылке',
          description:
            'Прохождение доступно по индивидуальной ссылке пользователям, на которых назначен опрос/тест',
          key: 'LINK_ONLY',
        },
      ]}
      selected={access}
      onChange={onChange}
    />
  );
});
