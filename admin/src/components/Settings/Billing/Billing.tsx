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


  useEffect(() => {
    const fetchData = async () => {
      if (!isLoading) setIsLoading(true);

      try {
        const billing: any = await billingRequests.getAllBilling();
        setIsNew(false);
        setData(billing);
        setValue(billing.country);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);




  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setData({
      ...data,
      [name]: value,
    });
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

    const billing : any = await billingRequests.getAllBilling();
    setData(billing);
    setValue(billing.country);
    setIsLoading(false);
  };


  const saveBilling = async (data: IBilling) => {
    if(!isNew)
      await billingRequests.editBilling(data.id,data);
    else
      await billingRequests.addBilling(data);

    await fetchData();
  }

  if (isLoading) return <LoadingIndicatorPage />;
  return (
    <Layout>
      <ContentLayout>
        <Box padding="2rem">
          <Typography variant="title">Billing information</Typography>
          <Box marginTop="2rem">
            <TextInput
              name="name"
              value={data.name}
              onChange={handleInputChange}
              fullWidth
              label="Legal business name"
            />
          </Box>
          <Box marginTop="1rem">
            <SingleSelect
              label="Country/region"
              placeholder="Select a country/region"
              onClear={() => {
                handleSingleSelectChange(undefined);
              }}
              value={value}
              onChange={handleSingleSelectChange}
            >
              {options.map((option) => (
                <SingleSelectOption key={option.key} value={option.value}>
                  {option.label}
                </SingleSelectOption>
              ))}
            </SingleSelect>;
          </Box>

          <Box>
            <TextInput
              name="address"
              value={data.address}
              onChange={handleInputChange}
              fullWidth
              label="Shipping address"
            />
          </Box>

          <Box marginTop="1rem">
            <TextInput
              name="apartment"
              value={data.apartment}
              onChange={handleInputChange}
              fullWidth
              label="Apartment, suite, etc."
            />
          </Box>
          <Grid gap={5}>
            <GridItem col={6} s={12}>
              <Box marginTop="1rem">
                <TextInput
                  name="postal"
                  value={data.postal}
                  onChange={handleInputChange}
                  fullWidth
                  label="Postal code"
                />
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
                />
              </Box>
            </GridItem>
          </Grid>
          <br />
          <Button onClick={() => saveBilling(data)} variant="secondary">
            Save
          </Button>
        </Box>

      </ContentLayout>
    </Layout>
  )
}

export default Billing;
