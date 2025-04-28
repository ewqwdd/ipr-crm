import { useAuthControl } from '@/shared/hooks/useAuthControl';
import './App.css';
import AppRouter from './router/AppRouter';
import { DarkSidebar } from '@/widgets/DarkSidebar';
import Loading from '@/shared/ui/Loading';
import { useCheckNotifications } from '@/shared/hooks/useCheckNotifications';
import { lazy, Suspense } from 'react';

const ModalWrapper = lazy(() => import('@/entities/modals/index'));

function App() {
  const { isMounted } = useAuthControl();
  useCheckNotifications();

  if (!isMounted) {
    return (
      <main className="flex items-center justify-center h-full bg-white">
        <Loading />
      </main>
    );
  }

  return (
    <main className="flex h-full bg-gray-100">
      <DarkSidebar />
      <div className="relative flex-1 overflow-y-auto">
        <AppRouter />
      </div>
      <Suspense>
        <ModalWrapper />
      </Suspense>
    </main>
  );
}

export default App;
