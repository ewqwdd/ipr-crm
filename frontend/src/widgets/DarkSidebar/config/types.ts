export type NavType = {
  name: string;
  icon?: (props: React.ComponentProps<'svg'>) => JSX.Element;
  href?: string;
  count?: number;
  children?: NavType[];
};
