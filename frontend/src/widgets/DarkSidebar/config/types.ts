export type NavType = {
  name: string;
  icon?: (props: React.ComponentProps<'svg'>) => JSX.Element;
  href?: string;
  current: boolean;
  count?: number;
  children?: NavType[];
};
