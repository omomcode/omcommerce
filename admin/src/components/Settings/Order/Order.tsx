import {
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Typography,
  Tbody,
  Td, GridItem

} from '@strapi/design-system';

import orderRequests from "../../../api/order";
import React, {ChangeEvent, useEffect, useState} from "react";
import {IOrder, IOrderDataNoJSON} from "../../../../../types/order";
import OrderModal from "../OrderModal/OrderModal";



const InitialData: IOrderDataNoJSON[] = [{
  order_id: "",
  amount: "",
  status: "",
  currency: "",
  items: [{
    SKU: "",
    name: "",
    quantity: 0,
    description: "",
    unit_amount: {
      value: 0,
      currency_code: "",
    }
  }],
  shipping_fee: "",
  tax_total: "",
  customer_name: "",
  customer_surname: "",
  email: "",
  address_line_1: "",
  postal_code: "",
  country_code: "",
}]
const Order = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [orders, setOrders] = useState<IOrderDataNoJSON[]>(InitialData);
  const [currentOrder, setCurrentOrder] = useState<IOrder>();

  useEffect(() => {
    fetchData().then((r) => console.log(r));
  }, []);

  const fetchData = async () => {
    if (!isLoading) setIsLoading(true);


    try {
      const or : any = await orderRequests.getAllOrders();

      let arr = new Array<IOrderDataNoJSON>(or.length)

      or.map((entry: { order_id: any; amount: any; status: any; currency: any; items: any; shipping_fee: any; tax_total: any; customer_name: any; customer_surname: any; email: any; address_line_1: any; postal_code: any; country_code: any; }) =>
        arr.push({
          order_id: entry.order_id,
          amount: entry.amount,
          status: entry.status,
          currency: entry.currency,
          items: entry.items,
          shipping_fee: entry.shipping_fee,
          tax_total: entry.tax_total,
          customer_name: entry.customer_name,
          customer_surname: entry.customer_surname,
          email: entry.email,
          address_line_1: entry.address_line_1,
          postal_code: entry.postal_code,
          country_code: entry.country_code,
        }))


      setOrders(or);


    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (order: IOrderDataNoJSON | React.SetStateAction<IOrder | undefined>) => {
    setModalShow((prevState) => !prevState)
    // @ts-ignore
    setCurrentOrder(order);
  }

  return (
    <Box padding={8} background="neutral100">
      <Table colCount={3}>
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma">ORDER_ID</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">AMOUNT</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">STATUS</Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map(entry => <Tr onClick={() => handleClick(entry)} key={entry.order_id}>

            <Td>
              <Typography textColor="neutral800">{entry.order_id}</Typography>
            </Td>

            <Td>
              <Typography textColor="neutral800">{entry.amount + " " + entry.currency}</Typography>
            </Td>
            <Td>
              <Typography textColor="neutral800">{entry.status}</Typography>
            </Td>
          </Tr>)}
        </Tbody>
      </Table>
      {modalShow && <GridItem>
        <OrderModal showModal={setModalShow} order={currentOrder}/>
      </GridItem>}
    </Box>
  )
}

export default Order
