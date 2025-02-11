import { FC } from 'react';

const ProgressBarBlock: FC = () => {
  return (
    <div>
      <h3 className="mt-16 text-sm font-bold tracking-tight text-gray-900">
        Общие результаты
      </h3>
      <p className="mt-4">
        В разделе представлены общие результаты оценки в виде рейтинга всех
        блоков компетенций по мнению экспертов (эксперты — все участники оценки,
        кроме оцениваемого). Оценки всех групп участников - среднее
        арифметическое по пятибалльной шкале, где 0 - минимальный балл, 4 -
        максимальный, н\о - не могу оценить. Шкала оценок экспертов (цвет цифр в
        таблицах соответствует шкале):
      </p>
      <div className="mt-[50px] flex gap-1">
        <div className="w-[50%]" aria-hidden="true">
          <div className="bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-red-600 rounded-full"
              style={{ width: '100%' }}
            />
          </div>
          <div className="">0</div>
          <div className="text-sm font-medium text-gray-600 mt-1">
            <div className="text-center">Ниже ожиданий</div>
          </div>
        </div>
        <div className="w-[25%]" aria-hidden="true">
          <div className="bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-indigo-600 rounded-full"
              style={{ width: '100%' }}
            />
          </div>
          <div className="flex justify-between">
            <div className="ml-[-0.5rem]">2</div>
            <div className="mr-[-0.5rem]">3</div>
          </div>
          <div className="text-sm font-medium text-gray-600 mt-1">
            <div className="text-center">Соответствует ожиданиям</div>
          </div>
        </div>
        <div className=" w-[25%]" aria-hidden="true">
          <div className="bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-green-600 rounded-full"
              style={{ width: '100%' }}
            />
          </div>
          <div className="text-right">4</div>
          <div className="text-sm font-medium text-gray-600 mt-1">
            <div className="text-center">Выше ожиданий</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBarBlock;
