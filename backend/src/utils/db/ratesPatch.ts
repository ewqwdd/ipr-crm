import { PrismaClient, UserRates } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
  const rates = await prisma.userRates.findMany();
  
  const ratesMap: Record<string, UserRates[]> = {}

  rates.forEach((rate) => {
    const key = `${rate.userId}-${rate.indicatorId}`;

    if (!ratesMap[key]) {
      ratesMap[key] = [rate];
    } else {
      ratesMap[key].unshift(rate);
    }

  });
  
  Object.entries(ratesMap).forEach(async ([key, rates]) => {
    if (rates.length > 0) {
        const ids = rates.map((r) => r.id);
        await prisma.userRates.deleteMany({
            where: {
                id: {
                    in: ids.slice(1),
                },
            },
        });
    }
  })

})();
