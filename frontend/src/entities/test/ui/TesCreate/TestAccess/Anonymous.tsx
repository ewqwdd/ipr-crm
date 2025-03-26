import { useAppDispatch, useAppSelector } from '@/app';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import { CardsRadio } from '@/shared/ui/CardsRadio';

export default function Anonymous() {
  const anonymous = useAppSelector((state) => !!state.testCreate.anonymous);
  const dispatch = useAppDispatch();

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
      onChange={(key) => {
        dispatch(
          testCreateActions.setField({
            field: 'anonymous',
            value: key === 'true',
          }),
        );
      }}
    />
  );
}
