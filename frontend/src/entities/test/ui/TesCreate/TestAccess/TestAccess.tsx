import Access from './Access';
import Anonymous from './Anonymous';
import EndDate from './EndDate';
import StartDate from './StartDate';

export default function TestAccess() {
  return (
    <div className="flex flex-col gap-8 mt-6 max-w-4xl">
      <div className="flex gap-8">
        <StartDate />
        <EndDate />
      </div>
      <Access />
      <Anonymous />
    </div>
  );
}
