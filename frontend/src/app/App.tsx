import { useAuthControl } from '@/shared/hooks/useAuthControl'
import './App.css'
import AppRouter from './AppRouter'
import { DarkSidebar } from '@/widgets/DarkSidebar'

function App() {
  const { isMounted } = useAuthControl()

  if (!isMounted) {
    return <main className="flex h-full bg-gray-600" />
  }

  return (
    <main className="flex h-full bg-gray-100">
      <DarkSidebar />
      <AppRouter />
    </main>
  )
}

export default App
