import { Checkbox } from '@/shared/ui/Checkbox';

const skillsFilters: Array<{ title: string; value: 'HARD' | 'SOFT' }> = [
  { title: 'Hard skills', value: 'HARD' },
  { title: 'Soft skills', value: 'SOFT' },
];

interface SkillsSwitcherProps {
  skills: string[];
  setSkills: (skills: string[]) => void;
}

export default function SkillsFilter({
  setSkills,
  skills,
}: SkillsSwitcherProps) {
  return skillsFilters.map(({ title, value }) => {
    const checked = skills.includes(value);
    return (
      <Checkbox
        key={value}
        name="skills"
        checked={checked}
        onChange={() => {
          if (!checked) {
            setSkills([...skills, value]);
          } else {
            setSkills(skills.filter((skill) => skill !== value));
          }
        }}
        title={title}
      />
    );
  });
}
