export const calculateDailyCartAbandonmentRates = (orders: any[]) => {
  const dailyAbandonmentRates: number[] = [];

  // Group orders by date
  const ordersByDate: { [date: string]: any[] } = {};
  orders.forEach((order) => {
    const date = order.date;
    if (date) {
      if (!ordersByDate[date]) {
        ordersByDate[date] = [];
      }
      ordersByDate[date].push(order);
    }
  });

  // Calculate daily abandonment rates
  for (const date in ordersByDate) {
    const completedCarts = ordersByDate[date].filter((order) => order.status === "COMPLETED");
    const abandonedCarts = ordersByDate[date].filter((order) => order.status === "CREATED");

    const abandonmentRate =
      (abandonedCarts.length / (completedCarts.length + abandonedCarts.length)) * 100;

    dailyAbandonmentRates.push(abandonmentRate);
  }

  return dailyAbandonmentRates;
};
