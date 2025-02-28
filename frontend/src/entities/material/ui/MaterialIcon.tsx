import { HTMLAttributes } from 'react';
import { MaterialType } from '../model/types';
import {
  DesktopComputerIcon,
  PaperClipIcon,
  VideoCameraIcon,
} from '@heroicons/react/outline';
import { BookOpenIcon } from '@heroicons/react/solid';

interface MaterialIconProps extends HTMLAttributes<HTMLOrSVGElement> {
  type: MaterialType;
}

export default function MaterialIcon({ type, ...props }: MaterialIconProps) {
  switch (type) {
    case 'VIDEO':
      return <VideoCameraIcon {...props} />;
    case 'BOOK':
      return <BookOpenIcon {...props} />;
    case 'COURSE':
      return <DesktopComputerIcon {...props} />;
    case 'ARTICLE':
      return <PaperClipIcon {...props} />;
  }
  return null;
}
