import { rate360Api } from '@/shared/api/rate360Api';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Link,
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
import LoadingOverlay from '@/shared/ui/LoadingOverlay';
import { useAppSelector } from '@/app';
import Tooltip from '@/shared/ui/Tooltip';
import { UserRateHeader } from '@/widgets/UserRateHeader';
import { generalService } from '@/shared/lib/generalService';
import { useInvalidateTags } from '@/shared/hooks/useInvalidateTags';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';

export default function Rate360Assesment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<number>();
  const { data, isFetching, isError } = rate360Api.useFindForUserQuery(
    parseInt(id ?? ''),
  );
  const userId = useAppSelector((state) => state.user.user!.id);
  const invalidateTags = useInvalidateTags();

  const loadingRef = useRef<number>();

  const { state } = useLocation();

  const [mutateApproval, approvalState] =
    rate360Api.useApproveAssignedMutation();
  const [mutateApproveSelf, approvalSelfState] =
    rate360Api.useApproveSelfMutation();

  const [assessment, setAssessment] = useState<AssesmentType>({});
  const [comments, setComments] = useState<Record<string, string | undefined>>(
    {},
  );
  const [notAnswered, setNotAnswered] = useState<number[]>([]);

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
      const assesmentData = generalService.tranformAssesment(blocks, data);
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

    if (!isCompleted) {
      const notAnswered = Object.values(assessment)
        .flatMap((a) => Object.values(a).flatMap((b) => Object.entries(b)))
        .filter(([, v]) => v.rate === undefined)
        .map(([k]) => +k);
      setNotAnswered(notAnswered);
      return toast.error('Ответьте на все вопросы');
    }
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
      invalidateTags(['Rate360', 'AssignedRate', 'SelfRate']);
    };
  }, [id]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  if (!id) return null;

  return (
    <LoadingOverlay active={isFetching} fullScereen>
      <div
        className={cva('flex flex-col h-full max-h-full pb-4', {
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
            notAnswered={notAnswered}
            setNotAnswered={setNotAnswered}
            loading={loadingRef}
          />
        )}
        <div className="flex justify-end px-6 pt-2 items-center gap-4">
          <Link to={'/progress'} className="mr-auto max-sm:hidden">
            <SecondaryButton>Назад</SecondaryButton>
          </Link>
          <p className="text-gray-600 sm:text-sm text-xs">
            Сохраняя, вы больше не сможете изменить оценку.
          </p>
          {(loading ?? 0) > 0 ? (
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
