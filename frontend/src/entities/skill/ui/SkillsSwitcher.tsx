import { Radio } from '@/shared/ui/Radio';

const skillsFilters: Array<{ title: string; value: 'HARD' | 'SOFT' }> = [
  { title: 'Hard skills', value: 'HARD' },
  { title: 'Soft skills', value: 'SOFT' },
];

interface SkillsSwitcherProps {
  value: 'HARD' | 'SOFT';
  setValue: (value: 'HARD' | 'SOFT') => void;
}

export default function SkillsSwitcher({
  setValue,
  value: filterValue,
}: SkillsSwitcherProps) {
  return skillsFilters.map(({ title, value }) => (
    <Radio
      key={value}
      name="skills"
      value={value}
      checked={filterValue === value}
      onChange={() => setValue(value)}
    >
      {title}
    </Radio>
  ));
}
