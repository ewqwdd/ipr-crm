import { Rate } from '@/entities/rates/types/types';
import { Radio } from '@/shared/ui/Radio';

const rateTypes: Array<{ title: string; value: Rate['rateType'] }> = [
  { title: '180', value: 'Rate180' },
  { title: '360', value: 'Rate360' },
];

interface RateTypeRadioProps {
  rateType: Rate['rateType'];
  setRateType: (rateType: Rate['rateType']) => void;
}

export default function RateTypeRadio({
  rateType,
  setRateType,
}: RateTypeRadioProps) {
  return rateTypes.map(({ title, value }) => {
    const checked = rateType === value;
    return (
      <Radio
        key={value}
        checked={checked}
        children={title}
        onChange={() => setRateType(value)}
        title={title}
      />
    );
  });
}
