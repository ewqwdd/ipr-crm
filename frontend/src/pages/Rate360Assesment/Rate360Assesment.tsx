import { rate360Api } from '@/shared/api/rate360Api';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import TabsHeader from './ui/TabsHeader';
import Assesment from './ui/Assesment';
import { Assesment as AssesmentType } from './types/types';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { cva } from '@/shared/lib/cva';
import { SecondaryButton } from '@/shared/ui/SecondaryButton';
import { tranformAssesment } from '@/shared/lib/transformAssesment';
import LoadingOverlay from '@/shared/ui/LoadingOverlay';

export default function Rate360Assesment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isFetching, isError } = rate360Api.useFindForUserQuery(
    parseInt(id ?? ''),
  );

  const [
    mutateAssesment,
    { isLoading: mutateAssesmentLoading, isSuccess: mutateAssesmentSuccess },
  ] = rate360Api.useAssesmentMutation();

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
    const body = Object.values(assessment)
      .flatMap((a) => Object.values(a))
      .reduce((acc, val) => ({ ...acc, ...val }), {});

    // @ts-expect-error похуй
    mutateAssesment({ rateId: data?.id, ratings: body, comments });
  };

  useEffect(() => {
    if (mutateAssesmentSuccess) {
      toast.success('Оценка сохранена');
      navigate('/progress');
    }
  }, [mutateAssesmentSuccess]);

  if (!id) return null;

  return (
    <LoadingOverlay active={isFetching || skillsFetching}>
      <div
        className={cva('flex flex-col gap-4 h-full max-h-full pb-6', {
          'animate-pulse pointer-events-none': mutateAssesmentLoading,
        })}
      >
        <TabsHeader blocks={blocks} />
        {currentBlock && (
          <Assesment
            comments={comments}
            setComments={setComments}
            assesment={assessment}
            setAssesment={setAssessment}
            block={currentBlock}
          />
        )}
        <div className="flex justify-between px-6">
          <Link to={'/progress'}>
            <SecondaryButton>Назад</SecondaryButton>
          </Link>
          <PrimaryButton onClick={() => onSave()}>Сохранить</PrimaryButton>
        </div>
      </div>
    </LoadingOverlay>
  );
}
