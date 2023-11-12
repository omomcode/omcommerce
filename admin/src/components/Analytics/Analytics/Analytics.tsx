import React, { useEffect, useRef, useState } from "react";
import {
  Layout,
  ContentLayout,
  Box,
  Flex,
} from "@strapi/design-system";
import orderRequests from "../../../api/order";
import {createDailySalesChart} from "../../../utils/analytics-helper/daily-sales-analytics";
import {getTopProducts} from "../../../utils/analytics-helper/top-products-analytics";
import TopProductsList from "../TopProduct/TopProductList";

const Analytics: React.FC = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [topProducts, setTopProducts] = useState<[string, number][]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const fetchedOrders : any = await orderRequests.getAllOrders();
      const topProductsData = getTopProducts(fetchedOrders, 5);

      setOrders(fetchedOrders);
      setTopProducts(topProductsData);

      if (chartRef.current && fetchedOrders) {
        createDailySalesChart(fetchedOrders, chartRef.current);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Layout>
      <ContentLayout>
        <Flex>
          <Box ref={chartRef} style={{ color: "white" }} />
          <Box>
            <TopProductsList topProducts={topProducts} />
          </Box>
        </Flex>
      </ContentLayout>
    </Layout>
  );
};

export default Analytics;
