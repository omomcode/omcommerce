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
  GridItem, Thead, Tr, Th, Tbody, Td, Table, Box, SingleSelect, SingleSelectOption, MultiSelect, MultiSelectOption
} from "@strapi/design-system";
import {IProduct} from "../../../../../types/product";
import {IShippingZone} from "../../../../../types/zonetable";
import {ITaxes} from "../../../../../types/taxes";
import taxRequests from "../../../api/tax";
import shippingZoneRequests from "../../../api/shippingzone";
import NoPaypalProduct from "../NoPaypalProduct/NoPaypalProduct";






export default function ProductsModal({showModal, product, handleUpdateProduct, paypalSelected} : {showModal: any, product: any, handleUpdateProduct : any, paypalSelected: any}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [data, setData] = useState<IProduct>(product);
  const [shippingZones, setShippingZones] = useState<IShippingZone[]>([]);
  const [taxes, setTaxes] = useState<ITaxes[]>([]);
  //const [options, setOptions] = useState<{ value: string; label: string; key: string }[]>(cOptions);
  const [value, setValue] = useState<string | undefined>(product.omcommerce_tax?.id.toString());
  const [multiValue, setMultiValue] = useState<string[] | undefined>(product.omcommerce_shippingzones);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nosubmit, setNoSubmit] = useState<boolean>(false);


  useEffect(() => {
    fetchData().then((r) => console.log(r));
  }, []);

  let sh :any;
  let tax: any;

  const fetchData = async () => {
    if (!isLoading) setIsLoading(true);

    const ids = product.omcommerce_shippingzones.map((item: any) => item.id.toString());

    setMultiValue(ids)

    try {
      tax = await taxRequests.getAllTaxes();
      sh = await shippingZoneRequests.getAllShippingZones();

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
    const selectedObjects = shippingZones.filter((item: any) => shids.includes(item.id.toString()));
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
    try {
      const newErrors: Record<string, string> = {};
      if (!data.title || data.title === "") {
        newErrors.title = "Product title is required";
      }

      if (!data.amount_value) {
        newErrors.amount_value = "Price is required"
      }

      setErrors(newErrors);

      // Check if there are any errors before saving
      if (Object.keys(newErrors).length > 0) {
        setNoSubmit(true);
      } else {
        setNoSubmit(false);
        handleUpdateProduct(data)
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
          Product Details
        </Typography>
      </ModalHeader>
      <ModalBody>
        {paypalSelected ? <Grid gap={5} marginBottom="2rem">
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
          <GridItem padding={1} col={6}>
            <Box marginTop="1rem">
              <TextInput
                name="amount_currency_code"
                value={data.amount_currency_code}
                onChange={handleInputChange}
                fullWidth
                placeholder="Currency"
                label="Currency"
              />
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
          <GridItem padding={1} col={6}>
            <Box marginTop="1rem">
              <TextInput
                name="amount_value_converted"
                value={data.amount_value_converted}
                onChange={handleInputChange}
                fullWidth
                placeholder="Converted price"
                label="Converted price"
              />
            </Box>
          </GridItem>
          <GridItem padding={1} col={6}>
            <Box marginTop="1rem">
              <TextInput
                label="Converted price currency"
                name="amount_value_converted_currency_code"
                value={data.amount_value_converted_currency_code}
                onChange={handleInputChange}
                fullWidth
                placeholder="Converted price currency"/>
            </Box>
            </GridItem>
          <GridItem col={6} s={12}>
            <Box marginTop="1rem">
              <MultiSelect

                label="Shipping Zones"
                placeholder="Select shipping zones"
                // hint="Will be used as a domestic country for shipping zone"
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
              {/*{errors.region && <Typography textColor="danger600">{errors.region}</Typography>}*/}
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
          :
          <NoPaypalProduct showModal={showModal} product={product}/>}
        {paypalSelected && <Button size="L" onClick={() => handleSave(data)} variant="secondary">
          Save
        </Button>}
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
