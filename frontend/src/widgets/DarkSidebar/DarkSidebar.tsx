/* This example requires Tailwind CSS v2.0+ */
import { useAppSelector } from '@/app'
import { CalendarIcon, ChartBarIcon, FolderIcon, HomeIcon, InboxIcon, UsersIcon } from '@heroicons/react/outline'
import { Link, Links, NavLink } from 'react-router'

type NavType = {
    name: string
    icon: (props: React.ComponentProps<'svg'>) => JSX.Element
    href: string
    current: boolean
    count?: number
} 

const navigation: NavType[] = [
  { name: 'Dashboard', icon: HomeIcon, href: '/', current: true },
  { name: 'Users', icon: UsersIcon, href: '/users', current: false },
  { name: 'Projects', icon: FolderIcon, href: '/projects', current: false },
  { name: 'Calendar', icon: CalendarIcon, href: '/calendar', current: false },
  { name: 'Documents', icon: InboxIcon, href: '/documents', current: false },
  { name: 'Reports', icon: ChartBarIcon, href: '/reports', current: false },
]

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function DarkSidebar() {
  const user = useAppSelector((state) => state.user.user)
  if (!user) return null
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-800 max-w-96">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
            alt="Workflow"
          />
        </div>
        <nav className="mt-5 flex-1 px-2 bg-gray-800 space-y-1" aria-label="Sidebar">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({isActive}) => classNames(
                isActive ? 'bg-gray-900 text-white [&_svg]:text-gray-300 [&_p]:bg-gray-800 [&_p]:hover:bg-gray-800' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
              )}
            >
              <item.icon
                className={'mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300'}
                aria-hidden="true"
              />
              <span className="flex-1">{item.name}</span>
              {item.count ? (
                <p
                  className={classNames(
                    'bg-gray-900 group-hover:bg-gray-800',
                    'ml-3 inline-block py-0.5 px-3 text-xs font-medium rounded-full'
                  )}
                >
                  {item.count}
                </p>
              ) : null}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex-shrink-0 flex bg-gray-700 p-4">
        <Link to="#" className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <div>
              <img
                className="inline-block h-9 w-9 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user.username}</p>
              <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">View profile</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
