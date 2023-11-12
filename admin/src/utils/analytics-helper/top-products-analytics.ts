interface OrderItem {
  SKU: string;
  unit_amount: {
    value: string;
  };
  quantity: string;
}

interface Order {
  items: OrderItem[];
  status: string;
}

type ProductRevenueMap = Map<string, number>;

export function getTopProducts(orders: Order[], topN: number): [string, number][] {
  const productRevenueMap: ProductRevenueMap = new Map();

  // Calculate product revenue for completed orders
  orders.forEach((order) => {
    if (order.status === 'COMPLETED') {
      order.items.forEach((item) => {
        const productSKU = item.SKU;
        const unitAmount = parseFloat(item.unit_amount.value);
        const quantity = parseInt(item.quantity);
        const revenue = unitAmount * quantity;

        if (productRevenueMap.has(productSKU)) {
          productRevenueMap.set(
            productSKU,
            productRevenueMap.get(productSKU)! + revenue
          );
        } else {
          productRevenueMap.set(productSKU, revenue);
        }
      });
    }
  });

  // Sort products by revenue in descending order
  const sortedProducts = [...productRevenueMap.entries()].sort(
    (a, b) => b[1] - a[1]
  );

  // Return the top N products
  return sortedProducts.slice(0, topN);
}
