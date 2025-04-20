import { Drawer } from '@/shared/ui/Drawer';
import { useState } from 'react';
import Content from './Content';
import { MenuIcon } from '@heroicons/react/outline';

export default function SidebMobile() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center size-12 fixed top-0 right-0 bg-gray-200 rounded-es-md hover:bg-gray-300 shadow-sm z-20"
        >
          <MenuIcon className="size-8" />
        </button>
      )}
      <Drawer open={open} setOpen={setOpen} dark>
        <Content />
      </Drawer>
    </>
  );
}
