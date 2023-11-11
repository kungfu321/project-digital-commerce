import prisma from "@/lib/prisma";
import { errorResponseJson, successResponseJson } from "@/lib/apiFormat";
import { Prisma } from "@prisma/client";

type ResultType = {
  totalRevenue: number;
  totalOrders: string;
  totalProductsSold: string;
  totalUsers: string;
  day: string;
}

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function (): string {
  return String(this);
};

export async function GET() {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const query = `
      SELECT
        DATE_TRUNC('day', orders. "updatedAt") AS day,
        SUM(orders.total) AS "totalRevenue",
        COUNT(orders.id) AS "totalOrders",
        SUM(order_items.total_quantity) AS "totalProductsSold",
        COUNT(users.id) AS "totalUsers"
      FROM
        "Order" AS orders
        JOIN (
          SELECT
            "orderId",
            SUM(quantity) AS total_quantity
          FROM
            "OrderItem"
          GROUP BY
            "orderId") AS order_items ON orders.id = order_items. "orderId"
        JOIN "User" AS users ON orders. "userId" = users.id
      WHERE
        orders.status = 'COMPLETED'
        AND (
          (DATE_TRUNC('month', orders."updatedAt") = DATE_TRUNC('month', CURRENT_DATE) AND orders."updatedAt" <= DATE_TRUNC('day', CURRENT_DATE))
          OR
          (DATE_TRUNC('month', orders."updatedAt") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND orders."updatedAt" <= DATE_TRUNC('day', CURRENT_DATE - INTERVAL '1 month') AND orders."updatedAt" < DATE_TRUNC('day', CURRENT_DATE))
        )
      GROUP BY
        day;
    `;

    const result = await prisma.$queryRaw<ResultType[]>`${Prisma.raw(query)}`;

    const sumData = {
      totalRevenue: 0,
      totalOrders: 0,
      totalProductsSold: 0,
      totalUsers: 0,
      totalLastMonthRevenue: 0,
      totalLastMonthOrders: 0,
      totalLastMonthProductsSold: 0,
      totalLastMonthUsers: 0
    };

    const thisMonth: ResultType[] = [];
    const lastMonth: ResultType[] = [];

    result.forEach((item) => {
      const entryDate = new Date(item.day);
      const isThisMonth = entryDate.getFullYear() === currentYear && entryDate.getMonth() === currentMonth;
      if (isThisMonth) {
        thisMonth.push(item);
        sumData.totalRevenue += item.totalRevenue;
        sumData.totalOrders += Number(item.totalOrders);
        sumData.totalProductsSold += Number(item.totalProductsSold);
        sumData.totalUsers += Number(item.totalUsers);
      } else {
        sumData.totalLastMonthRevenue += item.totalRevenue;
        sumData.totalLastMonthOrders += Number(item.totalOrders);
        sumData.totalLastMonthProductsSold += Number(item.totalProductsSold);
        sumData.totalLastMonthUsers += Number(item.totalUsers);
        lastMonth.push(item);
      }
    });

    const revenueFromLastMonth = ((sumData.totalRevenue - sumData.totalLastMonthRevenue) / sumData.totalLastMonthRevenue) * 100;
    const ordersFromLastMonth = ((sumData.totalOrders - sumData.totalLastMonthOrders) / sumData.totalLastMonthOrders) * 100;;
    const productsSoldFromLastMonth = ((sumData.totalProductsSold - sumData.totalLastMonthProductsSold) / sumData.totalLastMonthProductsSold) * 100;
    const usersFromLastMonth = ((sumData.totalUsers - sumData.totalLastMonthUsers) / sumData.totalLastMonthUsers) * 100;

    return successResponseJson({
      data: {
        thisMonth,
        lastMonth,
        ...sumData,
        revenueFromLastMonth,
        ordersFromLastMonth,
        productsSoldFromLastMonth,
        usersFromLastMonth
      },
    });
  } catch (error) {
    return errorResponseJson(error);
  }
}
