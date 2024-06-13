import {
  Layout,
  ContentLayout,
  Box,
  Typography,
  TextInput,
  SingleSelect,
  SingleSelectOption,
  Grid,
  GridItem,
  Button
} from "@strapi/design-system";
import React, {ChangeEvent, useEffect, useState} from "react";
import { Alert } from '@strapi/design-system';

import countriesData from "../../../data/countries.json";
import billingRequests from "../../../api/billing";
import {LoadingIndicatorPage} from "@strapi/helper-plugin";
import {IBilling} from "../../../../../types/billing";


const cOptions = countriesData.map((country) => ({
  value: country.code,
  label: country.name,
  key: country.code,
}));


const initialData: IBilling = {
  id: 0,
  name: "",
  country: "",
  address: "",
  apartment: "",
  postal: "",
  city: ""
};

const Billing = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [data, setData] = useState<IBilling>(initialData)
  const [value, setValue] = useState<string | undefined>(undefined);
  const [options, setOptions] = useState<{ value: string; label: string, key: string }[]>(cOptions);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nosubmit, setNoSubmit] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setData({
      ...data,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
    setNoSubmit(false);
  };

  const handleSingleSelectChange = (newValue: string | undefined) => {
    setValue(newValue);
    if (newValue !== undefined) {
      const fakeEvent = {
        target: {name: "country", value: newValue}
      } as ChangeEvent<HTMLInputElement>;
      handleInputChange(fakeEvent);
    }
  };

  const fetchData = async () => {
    if (!isLoading) setIsLoading(true);

    try {
      const billing: any = await billingRequests.getAllBilling();
      if(billing !== undefined) {
        setIsNew(false);
        setData(billing);
        setValue(billing.country);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const saveBilling = async (data: IBilling) => {
    const newErrors: Record<string, string> = {};
    if (!data.name) {
      newErrors.name = "Legal business name is required";
    }
    if (!data.country) {
      newErrors.country = "Country/region is required";
    }
    if (!data.address) {
      newErrors.address = "Shipping address is required";
    }
    if (!data.postal) {
      newErrors.postal = "Postal code is required";
    }
    if (!data.city) {
      newErrors.city = "City is required";
    }
    if (!data.apartment) {
      newErrors.apartment = "Apartment is required";
    }

    setErrors(newErrors);

    // Check if there are any errors before saving
    if (Object.keys(newErrors).length > 0) {
      setNoSubmit(true);
      //console.error("Please fill in all required fields");
    }
    if(!isNew) {
      setNoSubmit(false);
      await billingRequests.editBilling(data.id, data);
    }
    else {
      setNoSubmit(false);
      await billingRequests.addBilling(data);
      setIsNew(false)
    }

    await fetchData();
  }

  if (isLoading) return <LoadingIndicatorPage />;
  return (
    <Layout>
      <ContentLayout>
        {nosubmit &&<Alert marginBottom="2rem" closeLabel="Close" onClose={() => setNoSubmit(false)} title="Error" variant="danger">
          Fill all required fields.
        </Alert>}
        <Box padding="3rem" background="neutral0" borderRadius="4px" style={{ boxShadow: "rgba(3, 3, 5, 0.35) 1px 1px 10px" }}>
          <Typography variant="beta">Billing information</Typography>
          <Grid gap={5} marginBottom="2rem">
            <GridItem col={6} s={12}>
          <Box marginTop="1rem" >
            <TextInput
              name="name"
              value={data.name}
              onChange={handleInputChange}
              fullWidth
              label="Legal business name"
              required
            />
            {errors.name && <Typography textColor="danger600">{errors.name}</Typography>}
          </Box>
            </GridItem>
            <GridItem col={6} s={12}>
          <Box marginTop="1rem">
            <SingleSelect
              label="Country/region"
              placeholder="Select a country/region"
              onClear={() => {
                handleSingleSelectChange(undefined);
              }}
              value={value}
              onChange={handleSingleSelectChange}
              required
            >
              {options.map((option) => (
                <SingleSelectOption key={option.key} value={option.value}>
                  {option.label}
                </SingleSelectOption>
              ))}
            </SingleSelect>
            {errors.country && <Typography textColor="danger600">{errors.country}</Typography>}
          </Box>
            </GridItem>
            <GridItem col={6} s={12}>
          <Box marginTop="1rem">
            <TextInput
              name="address"
              value={data.address}
              onChange={handleInputChange}
              fullWidth
              label="Shipping address"
              required
            />
            {errors.address && <Typography textColor="danger600">{errors.address}</Typography>}
          </Box>
            </GridItem>
            <GridItem col={6} s={12}>
          <Box marginTop="1rem">
            <TextInput
              name="apartment"
              value={data.apartment}
              onChange={handleInputChange}
              fullWidth
              label="Apartment, suite, etc."
              required
            />
            {errors.apartment && <Typography textColor="danger600">{errors.apartment}</Typography>}
          </Box>
            </GridItem>
            <GridItem col={6} s={12}>
              <Box marginTop="1rem">
                <TextInput
                  name="postal"
                  value={data.postal}
                  onChange={handleInputChange}
                  fullWidth
                  label="Postal code"
                  required
                />
                {errors.postal && <Typography textColor="danger600">{errors.postal}</Typography>}
              </Box>
            </GridItem>
            <GridItem col={6} s={12}>
              <Box marginTop="1rem">
                <TextInput
                  name="city"
                  value={data.city}
                  onChange={handleInputChange}
                  fullWidth
                  label="City"
                  required
                />
                {errors.city && <Typography textColor="danger600">{errors.city}</Typography>}
              </Box>
            </GridItem>
          </Grid>
          <Button size="L" onClick={() => saveBilling(data)} variant="secondary">
            Save
          </Button>
        </Box>

      </ContentLayout>
    </Layout>
  )
}

export default Billing;
