import { useIsMobile } from "@/shared/hooks/useScreenWidth";
import Drawer from "@/shared/ui/Drawer";
import Modal from "@/shared/ui/Modal";
import type { ComponentProps } from "react";

type ModalProps = ComponentProps<typeof Modal>;
type DrawerProps = ComponentProps<typeof Drawer>;

export default function ConditionalModalDrawer(
  props: ModalProps & DrawerProps,
) {
  const isMobile = useIsMobile();

  const Cmp = isMobile ? Drawer : Modal;

  return <Cmp {...props} />;
}
