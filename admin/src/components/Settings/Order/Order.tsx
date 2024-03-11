import {
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Typography,
  Tbody,
  Td, GridItem,
  Button,
  VisuallyHidden,
  IconButton, Link, BaseHeaderLayout

} from '@strapi/design-system';

import {ArrowLeft, Trash} from '@strapi/icons';

import orderRequests from "../../../api/order";
import timezoneRequests from "../../../api/timezone";
import React, {useEffect, useState} from "react";
import {IOrder, IOrderDataNoJSON} from "../../../../../types/order";
import { IZoneData } from "../../../../../types/timezone";
import OrderModal from "../OrderModal/OrderModal";
import timezones from "timezones.json";

const initialTimezoneData: IZoneData = {
  id: 0,
  timezone: "",
  measurement: "Metric",
  unit: "",
  lengthUnit: ""
};

const InitialData: IOrderDataNoJSON[] = [{
  id: 0,
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
  created_at: "",
  updated_at: "",
}]
const Order = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [orders, setOrders] = useState<IOrderDataNoJSON[]>(InitialData);
  const [currentOrder, setCurrentOrder] = useState<IOrder>();
  const [timezoneData, setTimezoneData] = useState<IZoneData>(initialTimezoneData)

  useEffect(() => {
    fetchData().then((r) => console.log(r));
  }, []);

  const fetchData = async () => {
    if (!isLoading) setIsLoading(true);


    try {
      const or : any = await orderRequests.getAllOrders();
      const timezone: any = await timezoneRequests.getAllTimezone();
      let timezoneSubstring = '';
      if (timezone.timezone && timezone.timezone.includes(' ')) {
        timezoneSubstring = timezone.timezone.split(' ')[0];
      } else {
        // Handle the error or provide a default value
        timezoneSubstring = '0';
      }
      setTimezoneData(timezone);

      let arr = new Array<IOrderDataNoJSON>();

      or.map((entry: { id: any; order_id: any; amount: any; status: any; currency: any; items: any; shipping_fee: any; tax_total: any; customer_name: any; customer_surname: any; email: any; address_line_1: any; postal_code: any; country_code: any; createdAt: any; updatedAt: any; }) =>
        arr.push({
          id: entry.id,
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
          created_at: `${String(new Date(entry.createdAt).getMonth() + 1).padStart(2, '0')}/${String(new Date(entry.createdAt).getDate()).padStart(2, '0')}/${new Date(entry.createdAt).getFullYear()} ${String((new Date(entry.createdAt).getUTCHours() + parseInt(timezoneSubstring,10))).padStart(2, '0')}:${String(new Date(entry.createdAt).getMinutes()).padStart(2, '0')}:${String(new Date(entry.createdAt).getSeconds()).padStart(2, '0')}`,
          updated_at: (entry.createdAt !== entry.updatedAt) ?
            `${String(new Date(entry.updatedAt).getMonth() + 1).padStart(2, '0')}/${String(new Date(entry.updatedAt).getDate()).padStart(2, '0')}/${new Date(entry.updatedAt).getFullYear()} ${String((new Date(entry.updatedAt).getUTCHours() + parseInt(timezoneSubstring,10))).padStart(2, '0')}:${String(new Date(entry.updatedAt).getMinutes()).padStart(2, '0')}:${String(new Date(entry.updatedAt).getSeconds()).padStart(2, '0')}` : ""
        }))


      setOrders(arr);


    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await orderRequests.deleteOrder(id);
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }

  const handleClick = (order: IOrderDataNoJSON | React.SetStateAction<IOrder | undefined>) => {
    setModalShow((prevState) => !prevState)
    // @ts-ignore
    setCurrentOrder(order);
  }

  return (
    <Box padding={8} background="neutral100">
      <BaseHeaderLayout navigationAction={<Link startIcon={<ArrowLeft />} to="/">
        Go back
      </Link>}  title="Orders" subtitle={orders.length + " entries found"} as="h2" />
      <Table colCount={6}>
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
            <Th>
              <Typography variant="sigma">DATE_CREATED</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">DATE_COMPLETED</Typography>
            </Th>
            <Th>
              <VisuallyHidden>Actions</VisuallyHidden>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map(entry => <Tr  key={entry.id}>

            <Td onClick={() => handleClick(entry)}>
              <Typography textColor="neutral800">{entry.order_id}</Typography>
            </Td>

            <Td onClick={() => handleClick(entry)}>
              <Typography textColor="neutral800">{entry.amount + " " + entry.currency}</Typography>
            </Td>
            <Td onClick={() => handleClick(entry)}>
              <Typography textColor="neutral800">{entry.status}</Typography>
            </Td>
            <Td onClick={() => handleClick(entry)}>
              <Typography textColor="neutral800">{entry.created_at}</Typography>
            </Td >
            <Td onClick={() => handleClick(entry)}>
              <Typography textColor="neutral800">{entry.updated_at}</Typography>
            </Td>
            <Td>
            {entry.status === "CREATED" &&
              <Box paddingLeft={1}>
                <IconButton onClick={() => handleDelete(entry.id)} label="Delete" noBorder icon={<Trash />} />
              </Box>}
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
