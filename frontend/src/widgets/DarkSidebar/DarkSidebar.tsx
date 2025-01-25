/* This example requires Tailwind CSS v2.0+ */
import { lazy, Suspense } from 'react'
import Content from './Content'
import { useMaxMediaQuery } from '@/shared/hooks/useMediaQuery.ts'
import { useAppSelector } from '@/app/index.ts'

const SidebarMobile = lazy(() => import('./SidebarMobile.tsx'))

export default function DarkSidebar() {
  const isMobile = useMaxMediaQuery(1024)

  const user = useAppSelector((state) => state.user.user)
  
  if (!user) return null

  if (isMobile) {
    return (
      <Suspense fallback={null}>
        <SidebarMobile />
      </Suspense>
    )
  }

  return (
    <div className="w-1/3 flex flex-col min-h-0 bg-gray-800 max-w-96">
      <Content />
    </div>
  )
}
