import { Checkbox } from '@/shared/ui/Checkbox';
import { memo } from 'react';

interface ShowScoreToUserProps {
  showScoreToUser: boolean;
  onChange: () => void;
}

export default memo(function ShowScoreToUser({
  onChange,
  showScoreToUser,
}: ShowScoreToUserProps) {
  return (
    <div>
      <Checkbox
        onChange={onChange}
        checked={showScoreToUser}
        title="Показывать результат пользователю"
      />
    </div>
  );
});
