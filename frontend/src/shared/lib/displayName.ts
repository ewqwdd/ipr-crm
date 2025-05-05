import { User } from '@/entities/user';

type UserWithName = Partial<
  Pick<User, 'firstName' | 'lastName' | 'username' | 'email'>
>;

// TODO: replace logic with this function where possible
export const displayName = (user: UserWithName) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  } else if (user.firstName) {
    return user.firstName;
  } else if (user.lastName) {
    return user.lastName;
  } else if (user.username) {
    return user.username;
  }
  return user.email;
};
