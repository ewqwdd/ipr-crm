import { HTMLAttributes } from 'react';
import { ArchiveIcon, ClockIcon, RefreshIcon } from '@heroicons/react/outline';
import { SupportTicketStatus } from '../config/types';

interface SupportTicketStatusIconProps
  extends HTMLAttributes<HTMLOrSVGElement> {
  status: SupportTicketStatus;
}

export default function SupportTicketStatusIcon({
  status,
  ...props
}: SupportTicketStatusIconProps) {
  switch (status) {
    case 'CLOSED':
      return <ArchiveIcon {...props} />;
    case 'IN_PROGRESS':
      return <RefreshIcon {...props} />;
    case 'OPEN':
      return <ClockIcon {...props} />;
  }
}
