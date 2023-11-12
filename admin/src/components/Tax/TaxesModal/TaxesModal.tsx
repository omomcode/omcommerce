import React, {ChangeEvent, useEffect, useState} from "react";

import {
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Typography,
  Button,
  TextInput,
  Checkbox,
  RadioGroup,
  Radio, GridItem, Box, Grid, SingleSelect, SingleSelectOption
} from "@strapi/design-system";

import {ITaxes} from "../../../../../types/taxes";
import {findCountryFromCode} from "../../../utils/country-helper/country-helper";

const initialData : ITaxes =
  {
    id: 1,
    country_code: "",
    state_code: "",
    rate: 0,
    name: "",
    shipping: true
  }
export default function TaxesModal({ setShowTaxesModal, addTax ,taxId, taxData, mode}) {

  const [isLoading, setIsLoading] = useState(true);
  const [tax,setTax] = useState<ITaxes>(initialData);

  useEffect(() => {
    fetchData().then((r) => console.log(r));
  }, []);

  const fetchData = async () => {
    if (!isLoading) setIsLoading(true);

    if(taxData !== null && taxData!= undefined)
    {
      setTax(taxData);
    }

    try {} catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    e.stopPropagation();

    try {
      setShowTaxesModal(false);
    } catch (e) {
      console.log("error", e);
    }
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTax({
      ...tax,
      [name]: value,
    });

  };
  const handleShippingCheckboxChange = (value: boolean) => {
    setTax({
      ...tax,
      shipping: value,
    });
  };


  return (
    <ModalLayout
      onClose={() => setShowTaxesModal(false)}
      labelledBy="title"
      as="form"
      onSubmit={handleSubmit}
    >
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          {mode} tax
        </Typography>
      </ModalHeader>

      <ModalBody>


        <Box marginTop="1rem">
          <TextInput
            name="name"
            value={tax.name}
            onChange={handleInputChange}
            label="Name"
          />
        </Box>

        <Grid gap={5} marginTop="1rem">
          <GridItem col={6} s={12}>
            <TextInput
              name="country_code"
              value={tax.country_code}
              onChange={handleInputChange}
              label="Country code"
            />
          </GridItem>
          <GridItem col={6} s={12}>
            <TextInput
              name="country"
              value={findCountryFromCode(tax.country_code.toUpperCase())?.name}
              label="Country"
              disabled
            />
          </GridItem>
        </Grid>

        <Box marginTop="1rem">
          <TextInput
            name="state_code"
            value={tax.state_code}
            onChange={handleInputChange}
            label="State code"
          />
          <Box marginTop="1rem">
          <TextInput
            name="rate"
            value={tax.rate}
            onChange={handleInputChange}
            label="Rate"
          />
          </Box>
          <Box marginTop="1rem">
            <Checkbox
              id="shipping"
              name="shipping"
              onValueChange={handleShippingCheckboxChange}
              value={tax.shipping}
            >
              Tax on shipping
            </Checkbox>
          </Box>
        </Box>
        <Box marginTop="1rem">
          <Typography variant="omega">Calculated using formula tax = (rate x product_price)/(1+rate)</Typography>
        </Box>

      </ModalBody>
      <ModalFooter
        startActions={
          <Button onClick={() => setShowTaxesModal(false)} variant="tertiary">
            Cancel
          </Button>
        }
        endActions={<Button type="submit" onClick={() => addTax(tax)}> {mode} tax </Button>}
      />
    </ModalLayout>
  );
}
