import React, {ChangeEvent, useEffect, useState} from "react";
import {
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Typography,
  Button,
  TextInput,
  RadioGroup,
  Radio,
  NumberInput,
  Box,
  Grid,
  GridItem, Thead, Tr, Th, Tbody, Td, Table
} from "@strapi/design-system";

export default function OrderModal({showModal, order}) {

  console.log("Order thats here");
  console.log(order);
  return (
    <ModalLayout
      onClose={() => showModal((prevState) => !prevState)}
    >
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          Order Details
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Grid padding={1}>
          <GridItem padding={1} col={6}>
            <TextInput label="Order ID" name="order_id" value={order.order_id}/>
          </GridItem>
          <GridItem padding={1} col={6}>
            <TextInput label="Amount" name="amount" value={order.amount + " " + order.currency}/>
          </GridItem>
          <GridItem padding={1} col={6}>
            <TextInput label="Shipping fee" name="shipping_fee" value={order.shipping_fee + " " + order.currency}/>
          </GridItem>
          <GridItem padding={1} col={6}>
            <TextInput label="Total tax amount" name="tax_total" value={order.tax_total}/>
          </GridItem>
          <GridItem padding={1} col={6}>
            <TextInput label="Name" name="name" value={order.customer_name}/>
          </GridItem>
          <GridItem padding={1} col={6}>
            <TextInput label="Last name" name="last_name" value={order.customer_surname}/>
          </GridItem>
          <GridItem padding={1} col={6}>
            <TextInput label="Email" name="email" value={order.email}/>
          </GridItem>
          <GridItem padding={1} col={6}>
            <TextInput label="Address" name="address" value={order.address_line_1}/>
          </GridItem>
          <GridItem padding={1} col={6}>
            <TextInput label="Postal code" name="postal_code" value={order.postal_code}/>
          </GridItem>
          <GridItem padding={1} col={6}>
            <TextInput label="Country code" name="country_code" value={order.country_code}/>
          </GridItem>
          <GridItem padding={1} col={12}>
            <Table colCount={3}>
              <Thead>
                <Tr>
                  <Th>
                    <Typography variant="sigma">SKU</Typography>
                  </Th>
                  <Th>
                    <Typography variant="sigma">NAME</Typography>
                  </Th>
                  <Th>
                    <Typography variant="sigma">QUANTITY</Typography>
                  </Th>
                  <Th>
                    <Typography variant="sigma">DESCRIPTION</Typography>
                  </Th>
                  <Th>
                    <Typography variant="sigma">UNIT_AMOUNT</Typography>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {order.items.map(entry => <Tr key={entry.SKU}>

                  <Td>
                    <Typography textColor="neutral800">{entry.SKU}</Typography>
                  </Td>

                  <Td>
                    <Typography textColor="neutral800">{entry.name}</Typography>
                  </Td>
                  <Td>
                    <Typography textColor="neutral800">{entry.quantity}</Typography>
                  </Td>
                  <Td>
                    <Typography textColor="neutral800">{entry.description}</Typography>
                  </Td>
                  <Td>
                    <Typography
                      textColor="neutral800">{entry.unit_amount.value + " " + entry.unit_amount.currency_code}</Typography>
                  </Td>
                </Tr>)}
              </Tbody>
            </Table>
          </GridItem>
        </Grid>
      </ModalBody>

      <ModalFooter
        startActions={
          <Button onClick={() => showModal((prevState) => !prevState)} variant="tertiary">
            Cancel
          </Button>
        }

      />
    </ModalLayout>
  );
}
