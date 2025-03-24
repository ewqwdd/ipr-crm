import WithAvatarsAndMultiLineContent from './WithAvatarsAndMultiLineContent';
import { Heading } from '@/shared/ui/Heading';
import { AddUser } from '@/widgets/AddUser';

export default function Users() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-10 flex-1">
      <div className="sm:flex sm:items-center">
        <Heading
          title="Users"
          description="A list of all the users in your account including their name, title, email and role."
        />
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <AddUser />
        </div>
      </div>
      <div className="mt-2 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <WithAvatarsAndMultiLineContent />
          </div>
        </div>
      </div>
    </div>
  );
}
