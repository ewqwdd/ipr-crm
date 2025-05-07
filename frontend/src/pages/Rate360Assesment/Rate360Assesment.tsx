import { rate360Api } from '@/shared/api/rate360Api';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router';
import TabsHeader from './ui/TabsHeader';
import Assesment from './ui/Assesment';
import { Assesment as AssesmentType } from './types/types';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { cva } from '@/shared/lib/cva';
import { tranformAssesment } from '@/shared/lib/transformAssesment';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { useAppDispatch, useAppSelector } from '@/app';
import Tooltip from '@/shared/ui/Tooltip';
import { UserRateHeader } from '@/widgets/UserRateHeader';

export default function Rate360Assesment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(0);
  const { data, isFetching, isError } = rate360Api.useFindForUserQuery(
    parseInt(id ?? ''),
  );
  const userId = useAppSelector((state) => state.user.user!.id);
  const dispatch = useAppDispatch();

  const { state } = useLocation();

  const [mutateApproval, approvalState] =
    rate360Api.useApproveAssignedMutation();
  const [mutateApproveSelf, approvalSelfState] =
    rate360Api.useApproveSelfMutation();

  const [assessment, setAssessment] = useState<AssesmentType>({});
  const [comments, setComments] = useState<Record<string, string | undefined>>(
    {},
  );

  const [urlSearchParams] = useSearchParams();

  const tab = urlSearchParams.get('tab');

  useEffect(() => {
    if (isError) {
      toast.error('Оценка недоступна');
      navigate(-1);
    }
  }, [isError]);

  const blocks = data?.competencyBlocks ?? [];

  useEffect(() => {
    if (Object.keys(assessment).length === 0 && data) {
      const assesmentData = tranformAssesment(blocks, data);
      setAssessment(assesmentData);
      const comments: Record<number, string> = {};
      data.comments.forEach((comment) => {
        comments[comment.competencyId] = comment.comment;
      });
      setComments(comments);
    }
  }, [blocks, data]);

  const currentBlock = blocks.find((block) => block.id.toString() === tab);

  const onSave = () => {
    const indicators =
      blocks?.flatMap((block) =>
        block.competencies.flatMap((competency) => competency.indicators),
      ) ?? [];
    const userRates = Object.values(assessment)
      .flatMap((a) => Object.values(a).flatMap((b) => Object.values(b)))
      .filter((q) => q.rate !== undefined);

    const isCompleted = (userRates?.length ?? 0) >= indicators.length;

    if (!isCompleted) return toast.error('Ответьте на все вопросы');
    if (!data) return;
    if (data?.userId === userId) {
      mutateApproveSelf({ rateId: data.id });
    } else {
      mutateApproval({ rateId: data.id });
    }
  };

  useEffect(() => {
    if (approvalSelfState.isSuccess || approvalState.isSuccess) {
      toast.success('Оценка сохранена');
      navigate(typeof state === 'string' ? state : '/progress');
    }
  }, [approvalSelfState.isSuccess, approvalState.isSuccess, navigate, state]);

  useEffect(() => {
    if (approvalSelfState.isError || approvalState.isError) {
      toast.error('Ошибка при сохранении оценки');
    }
  }, [approvalSelfState.isError, approvalState.isError]);

  useEffect(() => {
    return () => {
      dispatch(rate360Api.util.invalidateTags(['Rate360', 'Assigned', 'Self']));
    };
  }, [id]);

  if (!id) return null;

  return (
    <LoadingOverlay active={isFetching}>
      <div
        className={cva('flex flex-col h-full max-h-full pb-6', {
          'animate-pulse pointer-events-none':
            approvalSelfState.isLoading || approvalState.isLoading,
        })}
      >
        <div className="pl-4 py-2">
          <UserRateHeader rate={data} />
        </div>
        <TabsHeader blocks={blocks} />
        {currentBlock && data && (
          <Assesment
            rateId={data.id ?? 0}
            comments={comments}
            setComments={setComments}
            assesment={assessment}
            setAssesment={setAssessment}
            block={currentBlock}
            setLoading={setLoading}
            skillType={data.type}
          />
        )}
        <div className="flex justify-end px-6">
          {/* <Link to={'/progress'}>
            <SecondaryButton>Назад</SecondaryButton>
          </Link> */}
          {loading > 0 ? (
            <Tooltip content="Подождите...">
              <PrimaryButton disabled={true}>Сохранить</PrimaryButton>
            </Tooltip>
          ) : (
            <PrimaryButton onClick={onSave}>Сохранить</PrimaryButton>
          )}
        </div>
      </div>
    </LoadingOverlay>
  );
}
