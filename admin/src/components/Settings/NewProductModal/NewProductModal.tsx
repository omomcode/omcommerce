import React, {ChangeEvent, useEffect, useState} from "react";
import {
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Typography,
  Button,
  TextInput,

  Grid,
  GridItem, Thead, Tr, Th, Tbody, Td, Table, Box, SingleSelect, SingleSelectOption,
  MultiSelect,MultiSelectOption
} from "@strapi/design-system";

import shippingZoneRequests from "../../../api/shippingzone";
import { IProduct } from "../../../../../types/product";
import { IShippingZone } from "../../../../../types/zonetable";
import { ITaxes } from "../../../../../types/taxes";
import {createLogger} from "@strapi/strapi/dist/commands/utils/logger";
import productcmsRequests from "../../../api/productcms";
import taxRequests from "../../../api/tax";
import productRequests from "../../../api/product";
const initialData: IProduct = {
  id: 0,
  title: "",
  slug: "",
  description: "",
  SKU: "",
  amount_currency_code: "",
  amount_value: 1,
  tax_currency_code: "EUR",
  tax_value: 0,
  media: [],
  compare_at_price: "",
  cost_per_item: "",
  chargeTax: false,
  Quantity: 0,
  Barcode: "",
  showQuantity: false,
  weight: 0,
  measurement_unit: "",
  omcommerce_tax: {} as ITaxes,
  omcommerce_shippingzones: [],
}


export default function NewProductModal({showModal, handleCreateProduct}: {showModal: any, handleCreateProduct: any}) {

  const [isLoading, setIsLoading] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [data, setData] = useState<IProduct>(initialData);
  const [shippingZones, setShippingZones] = useState<IShippingZone[]>([]);
  const [taxes, setTaxes] = useState<ITaxes[]>([]);
  //const [options, setOptions] = useState<{ value: string; label: string; key: string }[]>(cOptions);
  const [value, setValue] = useState<string | undefined>(undefined);
  const [multiValue, setMultiValue] = useState<string[] | undefined>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nosubmit, setNoSubmit] = useState<boolean>(false);

  useEffect(() => {
    fetchData().then((r) => console.log(r));
  }, []);

  let sh :any;
  let tax: any;

  const fetchData = async () => {
    if (!isLoading) setIsLoading(true);


    try {
      tax = await taxRequests.getAllTaxes();
      sh = await shippingZoneRequests.getAllShippingZones();
      console.log("taxes", tax);
      console.log("sh", sh);

     const arr: IShippingZone[] = [];
     const arrtax: ITaxes[] = [];

      if (sh) {
        (sh as IShippingZone[]).map((entry: IShippingZone) =>
          arr.push(entry)
        );
      }
      if(tax){
        (tax as ITaxes[]).map((entry: ITaxes) =>
          arrtax.push(entry)
        );
      }

      setShippingZones(arr);
      setTaxes(arrtax);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("newmodalproduct")

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("handleinputchange", name, value)
    setData({
      ...data,
      [name]: value,
    });
    // Clear validation error when the user starts typing
    setErrors({
      ...errors,
      [name]: "",
    });
    setNoSubmit(false);
  };

  const handleMultiInputChange = (shids: string[]) => {
    console.log("handlemultiinputchange", shids)
    const selectedObjects = shippingZones.filter((item: any) => shids.includes(item.id.toString()));
    console.log("selectedObject", selectedObjects)
    setData({
      ...data,
      omcommerce_shippingzones: selectedObjects,
    });
    // Clear validation error when the user starts typing
    setErrors({
      ...errors,
      omcommerce_shippingzones: "",
    });
    setNoSubmit(false);
  }

  const handleSingleSelectChange = (newValue: string | undefined) => {
    setValue(newValue);
    if (newValue !== undefined) {
      const fakeEvent = {
        target: { name: "omcommerce_tax", value: newValue },
      } as ChangeEvent<HTMLInputElement>;
      handleInputChange(fakeEvent);
    }
  };
  const handleMultiSelectChange = (newValue: string[] | undefined) => {
    setMultiValue(newValue);
    if (newValue !== undefined) {
      handleMultiInputChange(newValue);
    }
  }

  const handleSave = (data: any) => {
    console.log("handleCreateProduct", data)
    try {
      const newErrors: Record<string, string> = {};
      if (!data.title || data.title === "") {
        newErrors.title = "Product title is required";
      }

      if(!data.amount_value) {
        newErrors.amount_value = "Price is required"
      }

      setErrors(newErrors);

      // Check if there are any errors before saving
      if (Object.keys(newErrors).length > 0) {
        setNoSubmit(true);
      }
      else {
        setNoSubmit(false);
        handleCreateProduct(data)
      }

    } catch (error) {
      console.error("Error saving profile:", error);
    }


  }



  return (
    <ModalLayout
      onClose={() => showModal((prevState: any) => !prevState)}
    >
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          Create New Product
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Grid gap={5} marginBottom="2rem">
          <GridItem col={6} s={12}>
            <Box marginTop="1rem">
              <TextInput
                name="title"
                value={data.title}
                onChange={handleInputChange}
                fullWidth
                placeholder="Product Title"
                label="Product Title"
              />
              {errors.title && <Typography textColor="danger600">{errors.title}</Typography>}
            </Box>
          </GridItem>
          <GridItem col={6} s={12}>
            <Box marginTop="1rem">
              <TextInput
                name="Quantity"
                value={data.Quantity}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                fullWidth
                placeholder="Price"
                label="Price"
              />
              {errors.amount_value && <Typography textColor="danger600">{errors.amount_value}</Typography>}
            </Box>
          </GridItem>
          <GridItem col={6} s={12}>
            <Box marginTop="1rem">
              <TextInput
                name="cost_per_item"
                value={data.cost_per_item}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                fullWidth
                placeholder="Description"
                label="Description"
              />
            </Box>
          </GridItem>
          <GridItem col={6} s={12}>
            <Box marginTop="1rem">
              <TextInput
                name="description"
                value={data.description}
                onChange={handleInputChange}
                fullWidth
                placeholder="Description"
                label="Description"
              />
            </Box>
          </GridItem>
          <GridItem col={6} s={12}>
            <Box marginTop="1rem">
              <MultiSelect
                label="Shipping Zones"
                placeholder="Select shipping zones"
                onClear={() => {
                  handleMultiSelectChange(undefined);
                }}
                value={multiValue}
                onChange={handleMultiSelectChange}
                withTags
              >
                {shippingZones.map((option: any) => (
                  <MultiSelectOption key={option.id} value={option.id}>
                    {option.name}
                  </MultiSelectOption>
                ))}
              </MultiSelect>
            </Box>
          </GridItem>
          <GridItem col={6} s={12}>
            <Box marginTop="1rem">
              <SingleSelect
                label="Tax"
                placeholder="Select tax"
                // hint="Will be used as a domestic country for shipping zone"
                onClear={() => {
                  handleSingleSelectChange(undefined);
                }}
                value={value}
                onChange={handleSingleSelectChange}
              >
                {taxes.map((option: any) => (
                  <SingleSelectOption key={option.id} value={option.id}>
                    {option.name}
                  </SingleSelectOption>
                ))}
              </SingleSelect>
              {/*{errors.region && <Typography textColor="danger600">{errors.region}</Typography>}*/}
            </Box>
          </GridItem>
        </Grid>
        <Button size="L" onClick={() => handleSave(data)} variant="secondary">
          Save
        </Button>
        {/*<Grid padding={1}>*/}
        {/*  <GridItem padding={1} col={6}>*/}
        {/*    <TextInput label="ID" disabled name="id" value={product.id}/>*/}
        {/*  </GridItem>*/}
        {/*  <GridItem padding={1} col={6}>*/}
        {/*    <TextInput label="SKU" name="SKU" value={product.SKU}/>*/}
        {/*  </GridItem>*/}
        {/*  <GridItem padding={1} col={6}>*/}
        {/*    <TextInput label="Title" name="title" value={product.title}/>*/}
        {/*  </GridItem>*/}
        {/*  <GridItem padding={1} col={6}>*/}
        {/*    <TextInput label="Quantity" name="Quantity" value={product.Quantity}/>*/}
        {/*  </GridItem>*/}
        {/*  <GridItem padding={1} col={6}>*/}
        {/*    <TextInput label="Slug" name="slug" value={product.slug}/>*/}
        {/*  </GridItem>*/}
        {/*  <GridItem padding={1} col={6}>*/}
        {/*    <TextInput label="Price" name="amount_value" value={product.amount_value}/>*/}
        {/*  </GridItem>*/}
        {/*  <GridItem padding={1} col={6}>*/}
        {/*    <TextInput label="Currency" name="amount_currency_code" value={product.amount_currency_code}/>*/}
        {/*  </GridItem>*/}
        {/*  <GridItem padding={1} col={6}>*/}
        {/*    <TextInput label="Description" name="description" value={product.description}/>*/}
        {/*  </GridItem>*/}
        {/*  <GridItem padding={1} col={6}>*/}
        {/*    <TextInput label="Cost per item" hint="purchase cost in currently selected currency" name="cost_per_item" value={product.cost_per_item}/>*/}
        {/*  </GridItem>*/}
        {/*  /!*<GridItem padding={1} col={6}>*!/*/}
        {/*  /!*  <TextInput label="Discounted price" name="compare_at_price" value={product.compare_at_price}/>*!/*/}
        {/*  /!*</GridItem>*!/*/}

        {/*  <GridItem padding={1} col={6}>*/}
        {/*    <TextInput label="Converted price" name="amount_value_converted" value={product.amount_value_converted}/>*/}
        {/*  </GridItem>*/}
        {/*  <GridItem padding={1} col={6}>*/}
        {/*    <TextInput label="Currency of converted price" name="amount_value_converted_currency_code" value={product.amount_value_converted_currency_code}/>*/}
        {/*  </GridItem>*/}
        {/*  /!*<GridItem col={6} s={12}>*!/*/}
        {/*  /!*  <Box marginTop="1rem">*!/*/}
        {/*  /!*    <SingleSelect*!/*/}
        {/*  /!*      label={`Measurement Unit (${system})`}*!/*/}
        {/*  /!*      placeholder={`Select a unit (${system})`}*!/*/}
        {/*  /!*      value={unit}*!/*/}
        {/*  /!*      onChange={handleUnitChange}*!/*/}
        {/*  /!*      required*!/*/}
        {/*  /!*    >*!/*/}
        {/*  /!*      {unitsData[system].map((option) => (*!/*/}
        {/*  /!*        <SingleSelectOption key={option.value} value={option.value}>*!/*/}
        {/*  /!*          {option.label}*!/*/}
        {/*  /!*        </SingleSelectOption>*!/*/}
        {/*  /!*      ))}*!/*/}
        {/*  /!*    </SingleSelect>*!/*/}
        {/*  /!*    {errors.unit && <Typography textColor="danger600">{errors.unit}</Typography>}*!/*/}
        {/*  /!*  </Box>*!/*/}
        {/*  /!*</GridItem>*!/*/}
        {/*</Grid>*/}
      </ModalBody>

      <ModalFooter
        startActions={
          <Button onClick={() => showModal((prevState: any) => !prevState)} variant="tertiary">
            Cancel
          </Button>
        }

      />
    </ModalLayout>
  );
}
