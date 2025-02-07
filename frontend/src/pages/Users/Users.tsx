import { Link } from 'react-router';
import WithAvatarsAndMultiLineContent from './WithAvatarsAndMultiLineContent';
import { Heading } from '@/shared/ui/Heading';

export default function Users() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-10 flex-1">
      <div className="sm:flex sm:items-center">
        <Heading
          title="Users"
          description="A list of all the users in your account including their name, title, email and role."
        />
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/addUser"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add user
          </Link>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <WithAvatarsAndMultiLineContent />
          </div>
        </div>
      </div>
    </div>
  );
}
