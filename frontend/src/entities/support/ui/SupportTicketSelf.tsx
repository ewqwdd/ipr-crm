import { dateService } from '@/shared/lib/dateService';
import { SupportTicketType } from '../config/types';
import SupportTicketStatusIcon from './SupportTicketStatusIcon';

interface SpportTicketSelfProps {
  ticket: SupportTicketType;
}

export default function SupportTicketSelf({ ticket }: SpportTicketSelfProps) {
  const { title, description, status, createdAt } = ticket;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex gap-2 md:gap-4 text-sm items-center max-md:grid grid-cols-3">
      <div className="flex flex-1 items-center gap-4 col-span-2">
        <SupportTicketStatusIcon
          status={status}
          className="size-9 p-1.5 text-indigo-500 bg-indigo-100 rounded-full"
        />
        <span className="flex-1 text-gray-900 font-medium">{title}</span>
      </div>
      <span className="truncate text-gray-500 flex-1 max-w-96">
        {description}
      </span>
      <span className="text-gray-700 col-span-2">
        {dateService.formatDateTime(createdAt)}
      </span>
    </div>
  );
}
