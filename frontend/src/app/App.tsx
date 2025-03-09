import { useAuthControl } from '@/shared/hooks/useAuthControl';
import './App.css';
import AppRouter from './router/AppRouter';
import { DarkSidebar } from '@/widgets/DarkSidebar';
import ModalWrapper from '@/entities/modals';
import Loading from '@/shared/ui/Loading';
import GlobalLoader from '@/shared/ui/GlobalLoader';

function App() {
  const { isMounted } = useAuthControl();

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
        <GlobalLoader>
          <AppRouter />
        </GlobalLoader>
      </div>
      <ModalWrapper />
    </main>
  );
}

export default App;
