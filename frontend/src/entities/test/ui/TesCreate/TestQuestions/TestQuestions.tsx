import { useAppDispatch, useAppSelector } from '@/app';
import { PrimaryButton } from '@/shared/ui/PrimaryButton';
import { testCreateActions } from '../../../testCreateSlice';
import Question from './Question';
import { CreateQuestion } from '@/entities/test/types/types';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { cva } from '@/shared/lib/cva';

interface TestQuestionsProps {
  clearCorrectOptions: (index: number) => void;
  questions: CreateQuestion[];
  handleAddOption: (index: number) => void;
  onCorrectChange: (
    questionIndex: number,
    optionIndex: number,
    value: boolean,
  ) => void;
  onDeleteOption: (questionIndex: number, optionIndex: number) => void;
  onNameOptionChange: (
    questionIndex: number,
    optionIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onChangeType: (
    index: number,
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  onChangeName: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeRequired: (index: number, value: boolean) => void;
  onMaxLengthChange: (index: number, maxLength: string | undefined) => void;
  onTextCorrectChange: (index: number, value: string) => void;
  onNumberCorrectChange: (index: number, value: string) => void;
  onAllowDecimalChange: (index: number, value: boolean) => void;
  onMaxNumberChange: (index: number, value: string | undefined) => void;
  onMinNumberChange: (index: number, value: string | undefined) => void;
  deleteQuestion: (index: number) => void;
  setCorrectRequired: (index: number, value: boolean) => void;
  setMaxMinToggle: (index: number, value: boolean) => void;
  setOptionScore: (
    questionIndex: number,
    optionIndex: number,
    value: number | undefined,
  ) => void;
  setQuestionScore: (questionIndex: number, value: number | undefined) => void;
  changeQuestionOrder: (sourceIndex: number, destinationIndex: number) => void;
  setQuestionPhotoUrl: (index: number, url: string) => void;
}

export default function TestQuestions(props: TestQuestionsProps) {
  const { questions } = props;

  const error = useAppSelector((state) => state.testCreate.errors.questions);
  const dispatch = useAppDispatch();

  const handleAddQuestion = () => {
    dispatch(testCreateActions.addQuestion());
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) {
      return;
    }
    props.changeQuestionOrder(source.index, destination.index);
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
                      <Question {...props} key={index} index={index} />
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
}
