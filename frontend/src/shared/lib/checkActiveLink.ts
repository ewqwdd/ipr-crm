export const checkActiveLink = (href: string, pathname: string) =>
  new RegExp(`^${href}(?:/|$)`).test(pathname);
