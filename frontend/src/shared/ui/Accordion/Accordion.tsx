import { cva } from '@/shared/lib/cva'
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { ElementType, ReactNode, useRef } from 'react'

interface AccordionProps {
  title: ReactNode
  children: ReactNode
  className?: string
  as?: ElementType
  btnClassName?: string
  hideIcon?: boolean
  defaultOpen?: boolean
  titleClassName?: string
}

export default function Accordion({ title, children, className, as = 'div', btnClassName, hideIcon, defaultOpen, titleClassName }: AccordionProps) {
  return (
    <Disclosure as={as} className={className} defaultOpen={defaultOpen} >
      {({ open }) => (
        <>
          <dt className="text-lg">
            <Disclosure.Button className={cva("text-left w-full flex justify-between items-start text-gray-400 bg-transparent hover:bg-gray-200/80 transition-all duration-200 py-2.5 pr-2", btnClassName)}>
              <div className={cva("font-medium text-gray-900 flex-1", titleClassName)}>{title}</div>
              {!hideIcon && <span className="ml-6 h-7 flex items-center">
                <ChevronDownIcon
                  className={cva('h-6 w-6 transform rotate-0', {
                    '-rotate-180': open,
                  })}
                  aria-hidden="true"
                />
              </span>}
            </Disclosure.Button>
          </dt>
          <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
          <Disclosure.Panel as="dd" className="mt-2">
            <div className="text-base text-gray-500">{children}</div>
          </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
}
