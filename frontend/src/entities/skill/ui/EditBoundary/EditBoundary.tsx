import { SkillType } from '../../types/types';

interface EditBoundaryProps {
  boundary: number;
  setBoundary: React.Dispatch<React.SetStateAction<number>>;
  skillType?: SkillType;
}

export default function EditBoundary({
  boundary,
  setBoundary,
  skillType,
}: EditBoundaryProps) {
  return (
    <>
      <p className="text-gray-900 text-sm">
        <span className="font-medium">Граница оценки: </span>
        <span className="text-indigo-600">{boundary}</span>
      </p>

      <input
        className="w-full"
        type="range"
        min="1"
        max={skillType === 'SOFT' ? '4' : '5'}
        value={boundary}
        step={1}
        onChange={(e) => setBoundary(parseInt(e.target.value))}
      />
    </>
  );
}
