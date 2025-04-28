import Loading from '@/shared/ui/Loading';

export default function SuspenseLoader() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Loading />
    </div>
  );
}
