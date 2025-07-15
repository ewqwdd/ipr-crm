import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
  const rates = await prisma.rate360.findMany({
    where: {
      curatorConfirmed: true,
      userConfirmed: false,
    },
  });
  Promise.all(
    rates.map(async (rate) => {
      const updatedRate = await prisma.rate360.update({
        where: { id: rate.id },
        data: { userConfirmed: true },
      });
      console.log(
        `Updated rate ${rate.id} userConfirmed to ${updatedRate.userConfirmed}`,
      );
    }),
  );
})();
