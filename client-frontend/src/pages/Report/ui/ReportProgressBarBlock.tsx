import type { Rate } from "@/shared/types/Rate";

interface ProgressBarBlockProps {
  type: Rate["type"];
}

export default function ReportProgressBarBlock({
  type,
}: ProgressBarBlockProps) {
  const boundary = type === "HARD" ? 4 : 5;

  return (
    <>
      <p className="text-sm mt-3 font-semibold">
        Отчет отображает результаты, полученные при прохождении оценки по методу
        360/180 градусов. Результаты оценки 360 градусов базируются на мнениях
        руководителя, коллег, подчиненных, а также на самооценке самого
        участника команды. В небольших командах некоторые из ролей оценивающих
        могут отсутствовать. Цель отчета — дать участнику команды и его
        окружению обратную связь, помочь оцениваемому понять,как его
        воспринимают со стороны, увидеть свои сильные и слабые стороны, чтобы в
        результате усилить слабые стороны или более уверенно пользоваться своими
        сильными сторонами. Результаты оценки помогают подготовить планы для
        развития сотрудника,повысить эффективность взаимодействия за счет
        комплексной обратной связи.
      </p>
      <h2 className="mt-4">Общие результаты</h2>
      <p>
        В разделе представлены общие результаты оценки в виде рейтинга всех
        блоков компетенций по мнению экспертов (эксперты — все участники оценки,
        кроме оцениваемого). Оценки всех групп участников - среднее
        арифметическое по пятибалльной шкале, где 0 - минимальный балл,{" "}
        {boundary} - максимальный, н\о - не могу оценить. Шкала оценок экспертов
        (цвет цифр в таблицах соответствует шкале):
      </p>
      <div className="mt-[50px] flex gap-1">
        <div
          style={{
            width: `${(2 / boundary) * 100}%`,
          }}
          aria-hidden="true"
        >
          <div className="bg-[#ebe6e7] rounded-full overflow-hidden">
            <div className="h-2 bg-error rounded-full w-full" />
          </div>
          <div className="">0</div>
          <div className="text-sm font-medium text-[#4a5565] mt-1">
            <div className="text-center">Ниже ожиданий</div>
          </div>
        </div>
        <div
          aria-hidden="true"
          style={{
            width: `${(1 / boundary) * 100}%`,
          }}
        >
          <div className="bg-[#ebe6e7] rounded-full overflow-hidden">
            <div className="h-2 bg-accent rounded-full w-full" />
          </div>
          <div className="flex justify-between">
            <div className="ml-[-0.5rem]">2</div>
            <div className="mr-[-0.5rem]">3</div>
          </div>
          <div className="text-sm font-medium text-[#4a5565] mt-1">
            <div className="text-center">Соответствует ожиданиям</div>
          </div>
        </div>
        <div
          style={{
            width: `${((boundary - 3) / boundary) * 100}%`,
          }}
          aria-hidden="true"
        >
          <div className="bg-[#ebe6e7] rounded-full overflow-hidden">
            <div className="h-2 bg-success rounded-full w-full" />
          </div>
          <div className="text-right">{boundary}</div>
          <div className="text-sm font-medium text-[#4a5565] mt-1">
            <div className="text-center">Выше ожиданий</div>
          </div>
        </div>
      </div>
    </>
  );
}
