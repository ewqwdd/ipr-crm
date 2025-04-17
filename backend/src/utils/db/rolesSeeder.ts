import { PrismaClient } from '@prisma/client';
import { PasswordService } from '../password/password';

const prisma = new PrismaClient();
const passwordService = new PasswordService();

(async () => {
  const roles = await prisma.role.findMany();
  if (roles.length === 0) {
    await prisma.role.createMany({
      data: [{ name: 'admin' }, { name: 'user' }],
    });
  }

  const admin = await prisma.user.findFirst({
    where: { email: 'admin@ipr360.space' },
  });
  if (!admin) {
    const hash = await passwordService.getHash('de6acbbe');
    await prisma.user.create({
      data: {
        email: 'admin@ipr360.space',
        passwordHash: hash,
        username: 'admin',
        role: {
          connect: {
            id: 1,
          },
        },
      },
    });
  }
  console.log('Roles and admin user seeded successfully!');
})();
