import { prisma } from "~/db.server";

export function countProducts() {
  return prisma.product.count();
}

export function orderTotals() {
  return prisma.order.aggregate({
    _sum: {
      printfulTotal: true,
      total: true,
    },
    _count: {
      id: true,
    },
  });
}
