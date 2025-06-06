import { PrismaClient } from '@prisma/client';
import { PasswordService } from '../password/password';
import dotenv from 'dotenv';

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
    where: { email: 'admin@ayagroup.pro' },
  });
  if (!admin) {
    const hash = await passwordService.getHash(process.env.ADMIN_PASSWORD);
    await prisma.user.create({
      data: {
        email: 'admin@ayagroup.pro',
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
