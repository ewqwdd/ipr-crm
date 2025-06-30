import { Modal } from '@/shared/ui/Modal';
import { FC, useState } from 'react';
import { Pagination } from '@/shared/ui/Pagination';
import { surveyApi } from '@/shared/api/surveyApi';
import { usersService } from '@/shared/lib/usersService';
import { Link } from 'react-router';

type RateSurveyModalProps = {
  isOpen: boolean;
  modalData: unknown;
  closeModal: () => void;
};

const LIMIT = 10;

const RateSurveyModal: FC<RateSurveyModalProps> = ({
  closeModal,
  isOpen,
  modalData,
}) => {
  const { surveyId } = modalData as {
    surveyId?: number;
  };
  const [page, setPage] = useState(1);
  const { data: finishedSurveys, isLoading: finishedSurveysLoading } =
    surveyApi.useGetSurveysQuery();

  const survey = finishedSurveys?.find((survey) => survey.id === surveyId);

  const loading = finishedSurveysLoading;
  const users = survey?.usersAssigned;

  return (
    <Modal
      title="Статистика"
      open={isOpen}
      setOpen={closeModal}
      footer={false}
      loading={loading}
    >
      <div className="flex flex-col">
        <div className="text-sm text-gray-500 mb-4">Опрос: {survey?.name}</div>
        <div className="flex flex-col divide-y divide-gray-200">
          {users
            ?.slice((page - 1) * LIMIT, LIMIT * page)
            ?.map(({ id, user, finished }) => (
              <div
                key={id}
                className="flex items-center justify-between py-3 gap-4"
              >
                <div className="flex items-center gap-2">
                  <Link
                    to={`/users/${user.id}`}
                    className="text-gray-900 hover:text-violet-600 transition-all"
                  >
                    {usersService.displayName(user)}
                  </Link>
                  <span className="text-gray-500 text-sm">
                    {finished ? 'Завершено' : 'Не завершено'}
                  </span>
                </div>
              </div>
            ))}
        </div>
        {users && users.length > LIMIT && (
          <Pagination
            limit={LIMIT}
            page={page}
            setPage={setPage}
            count={users.length}
          />
        )}
        {users?.length === 0 && (
          <div className="text-gray-500 text-sm text-center py-4">
            Нет завершенных опросов
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RateSurveyModal;
