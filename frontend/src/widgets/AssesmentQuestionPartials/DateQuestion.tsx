import DatePicker, { DateObject } from 'react-multi-date-picker';

interface DateQuestionProps {
  answer: { dateAnswer?: string };
  onChange: (value: string) => void;
}

export default function DateQuestion({ answer, onChange }: DateQuestionProps) {
  const date = new Date(answer?.dateAnswer || '');

  const handleChange = (value: DateObject | null) => {
    if (value) {
      const dateValue = value.format('YYYY-MM-DD');
      onChange(dateValue);
    } else {
      onChange('');
    }
  };

  return <DatePicker value={date} onChange={handleChange} />;
}
