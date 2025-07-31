import { PrismaClient, UserRates } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
  try {
    console.log('Начинаем поиск и удаление дубликатов...');
    
    const rates = await prisma.userRates.findMany();
    console.log(`Найдено записей: ${rates.length}`);
    
    const ratesMap: Record<string, UserRates[]> = {};

    rates.forEach((rate) => {
      const key = `${rate.rate360Id}-${rate.userId}-${rate.indicatorId}`;

      if (!ratesMap[key]) {
        ratesMap[key] = [rate];
      } else {
        ratesMap[key].push(rate); // используем push вместо unshift для сохранения порядка
      }
    });
    
    let totalDeleted = 0;
    
    // Используем for...of вместо forEach для последовательного выполнения
    for (const [key, rates] of Object.entries(ratesMap)) {
      if (rates.length > 1) {
        const idsToDelete = rates.slice(1).map(r => r.id);
        
        const result = await prisma.userRates.deleteMany({
          where: {
            id: {
              in: idsToDelete,
            },
          },
        });
        
        totalDeleted += result.count;
        console.log(`${key}: удалено ${result.count} дубликатов из ${rates.length} записей`);
      }
    }
    
    console.log(`Всего удалено дубликатов: ${totalDeleted}`);
    
  } catch (error) {
    console.error('Ошибка при выполнении скрипта:', error);
  } finally {
    await prisma.$disconnect();
  }
})();