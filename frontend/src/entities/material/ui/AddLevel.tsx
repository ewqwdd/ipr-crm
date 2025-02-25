import { FC, memo } from 'react';

const levels = [0, 1, 2, 3, 4];

const AddLevel: FC<{ level: number; selectLevel: (level: number) => void }> =
  memo(({ level, selectLevel }) => {
    return (
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">
          Уровень сложности
          <span className="text-red-500 font-bold ml-1">*</span>
        </p>
        <div
          className={`grid grid-cols-${levels.length} border border-gray-300 rounded-md overflow-hidden`}
        >
          {levels.map((levelItem) => (
            <button
              key={levelItem}
              className={`p-2 text-center border-r last:border-r-0 border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition-all ${levelItem === level ? 'bg-gray-200' : ''}`}
              onClick={() => selectLevel(levelItem)}
            >
              {levelItem}
            </button>
          ))}
        </div>
      </div>
    );
  });

export default AddLevel;
