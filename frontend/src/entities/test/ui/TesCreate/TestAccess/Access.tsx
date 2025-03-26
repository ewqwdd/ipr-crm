import { useAppDispatch, useAppSelector } from '@/app';
import { testCreateActions } from '@/entities/test/testCreateSlice';
import { CardsRadio } from '@/shared/ui/CardsRadio';

export default function Access() {
  const access =
    useAppSelector((state) => state.testCreate.access) ?? 'PRIVATE';
  const dispatch = useAppDispatch();

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
      onChange={(key) => {
        dispatch(testCreateActions.setField({ field: 'access', value: key }));
      }}
    />
  );
}
