import { CardsRadio } from '@/shared/ui/CardsRadio';
import { memo } from 'react';

interface AnonymousProps {
  anonymous: boolean;
  onChangeAnonymous: (anonymous: string) => void;
}

export default memo(function Anonymous({
  anonymous,
  onChangeAnonymous,
}: AnonymousProps) {
  return (
    <CardsRadio
      elements={[
        {
          title: 'Неанонимный опрос',
          description:
            'Результаты прохождения опроса/теста отображают сведения обо всех пользователях, если пользователь не авторизован, то его ответы будут помечены как ответы гостя',
          key: 'false',
        },
        {
          title: 'Анонимный опрос',
          description:
            'Результаты прохождения опроса/теста не будут отображать сведения о пользователе',
          key: 'true',
        },
      ]}
      selected={anonymous.toString()}
      onChange={onChangeAnonymous}
    />
  );
});
