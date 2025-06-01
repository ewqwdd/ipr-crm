import { useAppDispatch, useAppSelector } from '@/app';
import { surveyCreateActions, SurveyQuestionCreate } from '@/entities/survey';
import { cva } from '@/shared/lib/cva';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { memo } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';

export default memo(function SurveyQuestions() {
  const error = useAppSelector(
    (state) => state.surveyCreate.errors.surveyQuestions,
  );
  const questions = useAppSelector(
    (state) => state.surveyCreate.surveyQuestions,
  );

  const dispatch = useAppDispatch();

  const handleAddQuestion = () => {
    dispatch(surveyCreateActions.addQuestion());
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;
    dispatch(
      surveyCreateActions.changeQuestionOrder({
        sourceIndex: source.index,
        destinationIndex: destination.index,
      }),
    );
  };

  return (
    <div className="flex flex-col gap-8 mt-6 max-w-4xl">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cva('p-2 rounded-lg transition-colors', {
                'bg-gray-200/50': snapshot.isDraggingOver,
              })}
            >
              {new Array(questions.length).fill(0).map((_, index) => (
                <Draggable key={index} draggableId={'q_' + index} index={index}>
                  {(provided, snapshot) => (
                    <div
                      className={cva(
                        'ring-indigo-300 ring-0 rounded-lg transition-shadow',
                        {
                          'ring-4': snapshot.isDragging,
                        },
                      )}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        userSelect: 'none',
                        margin: '0 0 16px 0',
                        ...provided.draggableProps.style,
                      }}
                    >
                      <SurveyQuestionCreate
                        questions={questions}
                        key={index}
                        index={index}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {error && <p className="text-red-500 font-medium">{error}</p>}
      <PrimaryButton onClick={handleAddQuestion} className="self-start">
        Добавить вопрос
      </PrimaryButton>
    </div>
  );
});
