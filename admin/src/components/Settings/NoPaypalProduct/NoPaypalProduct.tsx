import React, {useState} from "react";
import {
  Box, Grid,
  GridItem,
  TextInput,
} from "@strapi/design-system";
import {IProduct} from "../../../../../types/product";

export default function NoPaypalProduct ({showModal, product} : {showModal: any, product: any} ) {

  const [data, setData] = useState<IProduct>(product);

  return (
    <Grid gap={5} marginBottom="2rem">
      <GridItem padding={1} col={6}>
        <TextInput label="ID" disabled name="id" value={product.id}/>
      </GridItem>

      <GridItem padding={1} col={6}>
        <TextInput label="Slug" disabled name="slug" value={product.slug}/>
      </GridItem>
      <GridItem col={6} s={12}>
        <Box marginTop="1rem">
          <TextInput
            name="title"
            readOnly
            value={data.title}
            fullWidth
            placeholder="Product Title"
            label="Product Title"
          />
        </Box>
      </GridItem>
      <GridItem col={6} s={12}>
        <Box marginTop="1rem">
          <TextInput
            name="Quantity"
            readOnly
            value={data.Quantity}
            fullWidth
            placeholder="Quantity"
            label="Quantity"
          />
        </Box>
      </GridItem>
      <GridItem col={6} s={12}>
        <Box marginTop="1rem">
          <TextInput
            name="SKU"
            value={data.SKU}
            readOnly
            fullWidth
            placeholder="SKU"
            label="SKU"
          />
        </Box>
      </GridItem>
      <GridItem col={6} s={12}>
        <Box marginTop="1rem">
          <TextInput
            name="amount_value"
            value={data.amount_value}
            readOnly
            fullWidth
            placeholder="Price"
            label="Price"
          />
        </Box>
      </GridItem>
      {/*<GridItem padding={1} col={6}>*/}
      {/*  <Box marginTop="1rem">*/}
      {/*    <TextInput*/}
      {/*      name="amount_currency_code"*/}
      {/*      readOnly*/}
      {/*      value={data.amount_currency_code}*/}
      {/*      fullWidth*/}
      {/*      placeholder="Currency"*/}
      {/*      label="Currency"*/}
      {/*    />*/}
      {/*  </Box>*/}
      {/*</GridItem>*/}
      <GridItem col={6} s={12}>
        <Box marginTop="1rem">
          <TextInput
            name="cost_per_item"
            value={data.cost_per_item}
            readOnly
            fullWidth
            placeholder="Cost per item"
            label="Cost per item"
            hint="Purchase cost in currently selected currency"
          />
        </Box>
      </GridItem>
      <GridItem col={6} s={12}>
        <Box marginTop="1rem">
          <TextInput
            name="description"
            value={data.description}
            readOnly
            fullWidth
            placeholder="Description"
            label="Description"
          />
        </Box>
      </GridItem>
      {/*<GridItem padding={1} col={6}>*/}
      {/*  <Box marginTop="1rem">*/}
      {/*    <TextInput*/}
      {/*      name="amount_value_converted"*/}
      {/*      value={data.amount_value_converted}*/}
      {/*      readOnly*/}
      {/*      fullWidth*/}
      {/*      placeholder="Converted price"*/}
      {/*      label="Converted price"*/}
      {/*    />*/}
      {/*  </Box>*/}
      {/*</GridItem>*/}
      {/*<GridItem padding={1} col={6}>*/}
      {/*  <Box marginTop="1rem">*/}
      {/*    <TextInput*/}
      {/*      label="Converted price currency"*/}
      {/*      name="amount_value_converted_currency_code"*/}
      {/*      value={data.amount_value_converted_currency_code}*/}
      {/*      readOnly*/}
      {/*      fullWidth*/}
      {/*      placeholder="Converted price currency"/>*/}
      {/*  </Box>*/}
      {/*</GridItem>*/}
    </Grid>
  )
}
