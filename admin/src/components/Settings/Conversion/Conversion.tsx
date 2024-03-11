import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Layout,
  ContentLayout,
  Box,
  Typography,
  SingleSelect,
  SingleSelectOption,
  Button, TextInput,
  Grid, GridItem
} from "@strapi/design-system";
import { LoadingIndicatorPage } from "@strapi/helper-plugin";
import conversionRequests from "../../../api/conversionrate";
import { IConversionRate } from "../../../../../types/conversionrate";
import { currencies } from "currencies.json";
import { Alert } from '@strapi/design-system';

const initialData: IConversionRate = {
  id: 1,
  conversion_currency: "USD",
  rate: 0,
};

const Conversion = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [data, setData] = useState<IConversionRate>(initialData)
  const [value, setValue] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nosubmit, setNoSubmit] = useState<boolean>(false);

  const options = currencies.map((currency) => ({
    value: currency.code,
    label: `${currency.name} (${currency.code})`,
  }));

  useEffect(() => {
    fetchData();
  }, []);

  const handleSingleSelectChange = (newValue: string | undefined) => {
    setValue(newValue);
    if (newValue !== undefined) {
      const fakeEvent = {
        target: { name: "conversion_currency", value: newValue },
      } as ChangeEvent<HTMLInputElement>;
      handleInputChange(fakeEvent);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
    // Clear the error message when the user starts typing
    setErrors({
      ...errors,
      [name]: "",
    });
    setNoSubmit(false);
  };

  const fetchData = async () => {

    try {
      const currency : any = await conversionRequests.getAllConversionRate();
      if(currency !== undefined) {
        setIsNew(false);
        setData(currency);
        setValue(currency.conversion_currency);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCurrency = async (data: IConversionRate) => {
    // Validate if all required fields are filled
    const newErrors: Record<string, string> = {};
    if (!data.conversion_currency) {
      newErrors.conversion_currency = "Conversion Currency is required";
    }
    if (!data.rate) {
      newErrors.rate = "Rate is required";
    }

    setErrors(newErrors);

    // Check if there are any errors before saving
    if (Object.keys(newErrors).length > 0) {
      console.error("Please fill in all required fields");
      return;
    }
    if (!isNew){
      setNoSubmit(false);
      await conversionRequests.editConversion(data.id, data);}
    else {
      setNoSubmit(false);
      await conversionRequests.addConversion(data);
      setIsNew(false)
    }

    await fetchData();
  };

  if (isLoading) return <LoadingIndicatorPage />;
  return (
    <Layout>
      <ContentLayout>
        {nosubmit &&<Alert closeLabel="Close" onClose={() => setNoSubmit(false)} title="Error" variant="danger">
          Fill all required fields.
        </Alert>}
        <Box padding="3rem" background="neutral0" borderRadius="4px" style={{ boxShadow: "rgba(3, 3, 5, 0.35) 1px 1px 10px" }}>
          <Typography variant="beta">Store conversion currency</Typography>
          <Grid gap={5} marginBottom="2rem">
            <GridItem col={4} m={6} s={12}>
              <Box marginTop="1rem">
            <SingleSelect
              label="Store Currency"
              placeholder="Select a currency"
              hint="Currency to be shown on your store website"
              onClear={() => {
                handleSingleSelectChange(undefined);
              }}
              value={value}
              onChange={handleSingleSelectChange}
              required
            >
              {options.map((option) => (
                <SingleSelectOption key={option.value} value={option.value}>
                  {option.label}
                </SingleSelectOption>
              ))}
            </SingleSelect>
            {errors.conversion_currency && (
              <Typography textColor="danger600">{errors.conversion_currency}</Typography>
            )}
          </Box>
            </GridItem>
            <GridItem col={4} m={6} s={12}>
              <Box marginTop="1rem">
              <TextInput
              name="rate"
              value={data.rate}
              onChange={handleInputChange}
              fullWidth
              placeholder="Rate"
              label="Rate"
              required
            />
            {errors.rate && <Typography textColor="danger600">{errors.rate}</Typography>}
                </Box>
            </GridItem>
          </Grid>
          <Button size="L" onClick={() => saveCurrency(data)} variant="secondary">
            Save
          </Button>
        </Box>
      </ContentLayout>
    </Layout>
  );
};

export default Conversion;
