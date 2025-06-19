import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
  const users = await prisma.user.findMany();
  Promise.all(
    users.map(async (user) => {
      if (user.email !== user.email.toLowerCase()) {
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: { email: user.email.toLowerCase() },
        });
        console.log(`Updated user ${user.id} email to ${updatedUser.email}`);
      }
    }),
  );
})();
